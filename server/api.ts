import express, { Router } from 'express';
import User, { IUser, TerminalInfo } from './user';
import debug from 'debug';
import SocketManager from './socket-manager';
import Config from './config';
import COMServer, { ICOMServer } from './com-server';
import Terminal from './terminal';
import { Condition } from 'mongodb';
const log = debug('app:api');

declare global {
    namespace Express {
        interface Request {
            user: IUser
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
        if (req.user.admin) {
            log('Trying change terminal')
            const terminalInfo: TerminalInfo = await req.user.getTerminalById(req.query.id.toString());
            if (terminalInfo != null) {
                const { terminal } = terminalInfo;
                terminal.host = req.query.host.toString();
                terminal.port = parseInt(req.query.port.toString());
                terminal.name = req.query.name.toString();
                terminal.save();
                log('Changes succesfull');
                res.json({ success: true });
                return;
            }
        }
        res.json({ success: false });
    })

    router.get('/terminal.permissions', async (req, res) => {
        if(req.user.admin) {
            let term = await Terminal.findById(req.query.id);
            res.json(term.permissions);
            return;
        }
        res.json(null);
    })

    router.post('/terminal.permissions', express.json(), async (req, res) => {
        if (req.user.admin) {
            log('Trying change terminals permissons')
            const terminalInfo: TerminalInfo = await req.user.getTerminalById(req.query.id.toString());
            if (terminalInfo != null) {
                const { terminal } = terminalInfo;
                log("Permissions: %o", req.body);
                terminal.permissions = new Map(Object.entries(req.body))
                terminal.save();
                log('Changes in permissions succesfull');
                res.json({ success: true });
                return;
            }
        }
    })

    router.post('/terminal.restart', async (req, res) => {
        log('Restarting terminal %o', req.query);
        const terminalInfo: TerminalInfo = await req.user.getTerminalById(req.query.id.toString());
        if (terminalInfo != null) {
            const { host, port } = terminalInfo.terminal;
            SocketManager.restart({ host, port, config });
            res.json({ success: true });
            return;
        }
        res.json({ success: false });
    })

    router.get('/terminal.get', async (req, res) => {
        log('Getting terminal %o', req.query);
        const info: TerminalInfo = await req.user.getTerminalById(req.query.id.toString());
        if(info == null) {
            res.json(null);
            return;
        }
        let result = {
            id: info.terminal._id,
            name: info.terminal.name,
            readonly: info.readonly,
            editable: req.user.admin,
            comPort: info.terminal.port - 20000
        };
        if (req.user.admin) {
            Object.assign(result, {
                host: info.terminal.host,
                port: info.terminal.port
            })
        }
        res.json(result);
    })

    router.get('/comserver.list', async (req, res) => {
        const servers = await COMServer.find();
        res.json(servers.map(server => server.getInfo(req.user.admin)));
    })

    router.get('/comserver.terminals', async (req, res) => {
        const terminals = await Terminal.find({
            server: req.query.id as Condition<ICOMServer>
        })
        let visible = terminals;
        if(!req.user.admin) {
            visible = terminals.filter(term => term.visible(req.user.role));
        }
        res.json(visible.map(term => term.getInfo(req.user.admin, req.user.role)));
    })

    router.get('/user.isAdmin', (req, res) => {
        res.json(req.user.admin);
    })

    router.get('/user.list', async (req, res) => {
        if(req.user.admin) {
            const users = User.find();
            res.json(users);
            return;
        }
        res.json([]);
    })

    return router;
}

export default init;