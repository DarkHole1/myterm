import express, { Router } from 'express';
import { UserDocument, UserModel } from './models/user';
import debug from 'debug';
import SocketManager from './socket-manager';
import Config from './config';
import { TerminalModel } from './models/terminal';
import { isDocument, isDocumentArray } from '@typegoose/typegoose';
import { RoleModel } from './models/role';
import { z } from 'zod';
import { FolderModel } from './models/folder';
import rolesEndpoint from './api/roles';
import { usersEndpoint } from './api/users';
import Reason from './api/reasons';

const log = debug('app:api');

declare global {
    namespace Express {
        interface Request {
            user: UserDocument
        }
    }
}

function init(config: Config) {
    const router = Router();
    router.get('/terminal.list', (req, res) => {
        res.json(req.user.getTerminalsData().map(term => Object.assign({}, term, {
            editable: req.user.admin
        })));
    })

    router.post('/terminal.update', async (req, res) => {
        if (!req.user.admin) {
            res.json({ success: false });
            return
        }

        if (!req.query.id || !req.query.port || !req.query.name || !req.query.host) {
            res.json({ success: false });
            return
        }

        log('Trying change terminal')
        const terminalInfo = await req.user.getTerminalById(req.query.id.toString());

        if (terminalInfo == null) {
            res.json({ success: false });
            return
        }

        const { terminal } = terminalInfo;

        terminal.port = parseInt(req.query.port.toString());
        terminal.name = req.query.name.toString();
        terminal.host = req.query.host.toString();
        terminal.save();

        log('Changes succesfull');
        res.json({ success: true });
    })

    router.get('/terminal.permissions', async (req, res) => {
        if (!req.user.admin) {
            res.json(null)
            return
        }

        const term = await TerminalModel.findById(req.query.id)
        if (!term) {
            res.json(null)
            return
        }

        // HACK: there should be appropriate types, not any, but permissions is private...
        const permissionsList = await Promise.all(Array.from(term.permissions.entries()).map(async ([k, v]): Promise<[string, any]> => {
            const role = await RoleModel.findById(k)
            return [role?.name || '', v]
        }))

        const permissions = Object.fromEntries(permissionsList)

        res.json(permissions)
    })

    router.post('/terminal.permissions', express.json(), async (req, res) => {
        if (!req.user.admin || !req.query.id) {
            res.json({ success: false })
            return
        }

        log('Trying change terminals permissons')
        const terminalInfo = await req.user.getTerminalById(req.query.id.toString())
        if (!terminalInfo) {
            res.json({ success: false })
            return
        }

        const { terminal } = terminalInfo
        log("Permissions: %o", req.body)
        const Permissions = z.object({
            show: z.boolean(),
            write: z.boolean()
        })
        const permissionsPairs = Object.entries(req.body)
        const roleIds = permissionsPairs.map(([roleId, _]) => roleId)
        const rolesFromIds = await Promise.all(roleIds.map(roleId => RoleModel.findById(roleId)))
        if (rolesFromIds.some(role => !role)) {
            return res.json({ success: false })
        }

        try {
            const parsedPermissions = permissionsPairs.map(
                ([roleId, permissions]): [string, z.infer<typeof Permissions>] =>
                    [roleId, Permissions.parse(permissions)]
            )
            terminal.permissions = new Map(parsedPermissions)
            await terminal.save();
            log('Changes in permissions succesfull')
            return res.json({ success: true });
        } catch (err) {
            return res.json({ succcess: false })
        }
    })

    router.post('/terminal.restart', async (req, res) => {
        if (!req.query.id) {
            res.json({ success: false })
            return
        }

        log('Restarting terminal %o', req.query);
        const terminalInfo = await req.user.getTerminalById(req.query.id.toString());
        if (!terminalInfo) {
            res.json({ success: false })
            return
        }

        const { host, port } = terminalInfo.terminal
        SocketManager.restart({ host, port, config })
        res.json({ success: true })
    })

    router.get('/terminal.get', async (req, res) => {
        if (!req.query.id) {
            res.json(null)
            return
        }

        log('Getting terminal %o', req.query);
        const info = await req.user.getTerminalById(req.query.id.toString());
        if (!info) {
            res.json(null)
            return
        }

        let result = {
            id: info.terminal._id,
            name: info.terminal.name,
            readonly: info.readonly,
            editable: req.user.admin,
            comPort: info.terminal.port - 20000
        }

        if (req.user.admin) {
            Object.assign(result, {
                host: info.terminal.host,
                port: info.terminal.port
            })
        }
        res.json(result);
    })

    router.post('/terminal.add', async (req, res) => {
        if (!req.user.admin) {
            return res.json({ success: false, reason: Reason.NotAnAdmin })
        }

        const RawQuery = z.object({
            folder: z.string()
        })

        const parsedQuery = RawQuery.safeParse(req.query)
        if(!parsedQuery.success) {
            return res.json({ success: false, reason: Reason.ValidationFailed })
        }

        const folder = await FolderModel.findById(parsedQuery.data.folder)
        if(!folder) {
            return res.json({ success: false, reason: Reason.FolderNotFound })
        }
        
        log('Creating new terminal')
        const terminal = new TerminalModel({
            name: "Новый терминал",
            host: "127.0.0.1",
            port: 20001,
            permissions: {}
        })
        await terminal.save()
        
        folder.terminals.push(terminal._id)
        await folder.save()
        res.json({ success: true })
    })

    router.delete('/terminal', async (req, res) => {
        log('Deleting terminal')
        if (req.user.admin) {
            await TerminalModel.findByIdAndDelete(req.query.id)
            res.json({ success: true })
            return
        }
        res.json({ success: false })
    })

    router.get('/folder.list', async (req, res) => {
        const folders = await FolderModel.find()
        res.json(folders.map(folder => folder.getInfo()))
    })

    router.get('/folder.terminals', async (req, res) => {
        const QuerySchema = z.object({
            id: z.string()
        })

        const parsedQuery = QuerySchema.safeParse(req.query)
        if(!parsedQuery.success) {
            return res.json([])
        }

        const folder = await FolderModel.findById(parsedQuery.data.id).populate('terminals')
        if(!folder || !isDocumentArray(folder.terminals)) {
            return res.json([])
        }

        const terminals = folder.terminals

        const role = req.user.role
        if (!role) {
            return res.json([])
        }

        let visible = terminals;
        if (!req.user.admin) {
            visible = terminals.filter(term => term.visible(role));
        }

        res.json(visible.map(term => term.getInfo(req.user.admin, role)));
    })

    router.use(usersEndpoint(config))

    router.use(rolesEndpoint(config))

    return router;
}

export default init;