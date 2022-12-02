import express, { Router } from 'express';
import { UserDocument, UserModel } from './models/user';
import debug from 'debug';
import SocketManager from './socket-manager';
import Config from './config';
import { COMServerDocument, COMServerModel } from './models/com-server';
import { TerminalModel } from './models/terminal';
import { Condition } from 'mongodb';
import { isDocument } from '@typegoose/typegoose';
import { Role, RoleModel } from './models/role';
import { z } from 'zod';
import { type } from 'os';

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

        if (!isDocument(terminal.server)) {
            res.json({ success: false });
            return
        }

        terminal.port = parseInt(req.query.port.toString());
        terminal.name = req.query.name.toString();
        terminal.save();
        terminal.server.host = req.query.host.toString();
        terminal.server.save();

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
        log('Creating new terminal')
        if (req.user.admin) {
            const terminal = new TerminalModel();
            terminal.name = "Новый терминал";
            terminal.server = req.query.server as any;
            terminal.host = '127.0.0.1'
            terminal.port = 20001
            await terminal.save()
            res.json({ success: true })
            return
        }
        res.json({ success: false })
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

    router.get('/comserver.list', async (req, res) => {
        const servers = await COMServerModel.find();
        res.json(servers.map(server => server.getInfo(req.user.admin)));
    })

    router.get('/comserver.terminals', async (req, res) => {
        const terminals = await TerminalModel.find({
            server: req.query.id as Condition<COMServerDocument>
        }).populate('server')

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

    router.get('/user.isAdmin', (req, res) => {
        if (!req.user) {
            res.status(401);
            res.end();
            return;
        }
        res.json(req.user.admin);
    })

    router.get('/user.list', async (req, res) => {
        if (!req.user.admin) {
            return res.json([]);
        }

        log('Starting getting users')
        const users = await UserModel.find().populate('role')
        const mapped = users.map(({ id, role, name }) => {
            if (isDocument(role)) {
                // Bug in typecheck?
                return { id, role: (role as any).name, name }
            }
            return { id, role, name }
        });
        log("Users: %o", mapped);
        res.json(mapped);
        return;
    })

    router.post('/user.update', express.json(), async (req, res) => {
        if (!req.query.id) {
            res.json({ success: false })
            return
        }

        if (!req.user.admin) {
            res.json({ success: false })
            return
        }

        log('Trying change user %s', req.query.id)
        const user = await UserModel.findById(req.query.id.toString())

        if (!user) {
            res.json({ success: false })
            return
        }

        log("Changes: %o", req.body);
        Object.assign(user, req.body);
        user.save();
        log('Changes in user succesfull');
        res.json({ success: true });
    })

    router.post('/user.login', express.json(), async (req, res) => {
        // console.log("%o", UserModel.schema)
        const user = await UserModel.findOne({
            name: req.body.name,
            password: req.body.password
        })
        if (!user) {
            res.json({ success: false })
            return
        }

        res.cookie('name', req.body.name, {
            sameSite: 'none',
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.cookie('password', req.body.password, {
            sameSite: 'none',
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.json({ success: true })
    })

    router.post('/user.logout', async (req, res) => {
        res.clearCookie('name', {
            sameSite: 'none', secure: true
        });
        res.clearCookie('password', {
            sameSite: 'none', secure: true
        });
        res.end();
    })

    router.post('/user.add', async (req, res) => {
        log('Creating user')
        if (req.user.admin) {
            const user = new UserModel();
            user.name = "Новый пользователь";
            user.password = 'P@ssw0rd';
            await user.save();
            res.json({ success: true })
            return
        }
        res.json({ success: false })
    })

    router.delete('/user', async (req, res) => {
        if (!req.user.admin) {
            res.json({ success: false })
            return
        }

        log('Deleting user')
        const user = await UserModel.findById(req.query.id)

        if (!user) {
            res.json({ success: false })
            return
        }

        if (user.admin) {
            res.json({ success: false })
            return
        }

        await user.delete()
        res.json({ success: true })
    })

    router.get('/role.list', async (_, res) => {
        const roles = await RoleModel.find()
        log('Roles: %o', roles)
        res.json(roles.map(({ _id, name }) => ({ id: _id, name })))
    })

    router.post('/role.rename', async (req, res) => {
        if (!req.user.admin || !req.query.to || !req.query.from) {
            res.json({ success: false })
            return
        }

        const { from, to } = req.query
        const role = await RoleModel.findOne({ name: from })
        if (!role) {
            return res.json({ success: false })
        }

        role.name = to.toString()
        await role.save()

        res.json({ success: true })
    })

    router.post('/role.create', express.json(), async (req, res) => {
        const Body = z.object({ name: z.string() })
        if (!req.user.admin) {
            return res.json({ success: false })
        }

        log("Creating role...")
        try {
            const parsedBody = Body.parse(req.body)
            const role = new RoleModel({ name: parsedBody.name })
            await role.save()
            log("Role created successfully")
            return res.json({ success: true, data: { id: role._id, name: role.name } })
        } catch (e) {
            log("Error occured: %e", e)
            return res.json({ success: false })
        }
    })

    return router;
}

export default init;