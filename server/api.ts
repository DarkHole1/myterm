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
                terminal.port = parseInt(req.query.port.toString());
                terminal.name = req.query.name.toString();
                terminal.save();
                terminal.server.host = req.query.host.toString();
                terminal.server.save();
                log('Changes succesfull');
                res.json({ success: true });
                return;
            }
        }
        res.json({ success: false });
    })

    router.get('/terminal.permissions', async (req, res) => {
        if (req.user.admin) {
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
        res.json({ success: false });
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
        if (info == null) {
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

    router.post('/terminal.add', async (req, res) => {
        log('Creating new terminal')
        if (req.user.admin) {
            const terminal = new Terminal();
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
            await Terminal.findByIdAndDelete(req.query.id)
            res.json({ success: true })
            return
        }
        res.json({ success: false })
    })

    router.get('/comserver.list', async (req, res) => {
        const servers = await COMServer.find();
        res.json(servers.map(server => server.getInfo(req.user.admin)));
    })

    router.get('/comserver.terminals', async (req, res) => {
        const terminals = await Terminal.find({
            server: req.query.id as Condition<ICOMServer>
        }).populate('server')
        let visible = terminals;
        if (!req.user.admin) {
            visible = terminals.filter(term => term.visible(req.user.role));
        }
        res.json(visible.map(term => term.getInfo(req.user.admin, req.user.role)));
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
        if (req.user.admin) {
            log('Starting getting users')
            const users = await User.find();
            const mapped = users.map(({ id, role, name }) => ({ id, role, name }));
            log("Users: %o", mapped);
            res.json(mapped);
            return;
        }
        res.json([]);
    })

    router.post('/user.update', express.json(), async (req, res) => {
        if (req.user.admin) {
            log('Trying change user %s', req.query.id);
            const user = await User.findById(req.query.id.toString());
            if (user != null) {
                log("Changes: %o", req.body);
                Object.assign(user, req.body);
                user.save();
                log('Changes in user succesfull');
                res.json({ success: true });
                return;
            }
        }
        res.json({ success: false });
    })

    router.post('/user.login', express.json(), async (req, res) => {
        const user = await User.findOne({
            name: req.body.name,
            password: req.body.password
        })
        if (user != null) {
            // For debug purposes
            res.cookie('name', req.body.name, {
                sameSite: 'none',
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            res.cookie('password', req.body.password, {
                sameSite: 'none',
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            res.json({ success: true })
            return;
        }
        res.json({ success: false });
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
            const user = new User();
            user.name = "Новый пользователь";
            user.password = 'P@ssw0rd';
            await user.save();
            res.json({ success: true })
            return
        }
        res.json({ success: false })
    })

    router.delete('/user', async (req, res) => {
        log('Deleting user')
        if (req.user.admin) {
            const user = await User.findById(req.query.id)
            if (user.admin) {
                res.json({ success: false })
                return
            }
            await user.delete()
            res.json({ success: true })
            return
        }
        res.json({ success: false })
    })

    router.get('/role.list', async (req, res) => {
        const terminals = await Terminal.find()
        const roles = terminals.map(t => Array.from(t.permissions.keys())).reduce((s, a) => a.reduce((s, b) => s.add(b), s), new Set())
        log('Roles: %o', roles)
        res.json(Array.from(roles.values()))
    })

    router.post('/role.raname', async (req, res) => {
        if(req.user.admin) {
            const {from, to} = req.query
            const terminals = await Terminal.find()
            for(let terminal of terminals) {
                if(terminal.permissions.has(from as string)) {
                    let val = terminal.permissions.get(from as string)
                    terminal.permissions.delete(from as string)
                    terminal.permissions.set(to as string, val)
                }
                await terminal.save()
            }
            return res.json({ success: true })
        }
        res.json({ success: false })
    })

    return router;
}

export default init;