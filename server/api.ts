import { Router } from 'express';
import { IUser, TerminalInfo } from './user';
import debug from 'debug';
import SocketManager from './socket-manager';
import Config from './config';
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
        res.json(req.user.terminals.map((info: TerminalInfo) => {
            let res = {
                id: info.terminal._id,
                name: info.terminal.name,
                readonly: info.readonly,
                editable: req.user.admin
            };
            if (req.user.admin) {
                Object.assign(res, {
                    host: info.terminal.host,
                    port: info.terminal.port
                })
            }
            return res;
        }));
    })

    router.post('/terminal.update', (req, res) => {
        if (req.user.admin) {
            log('Trying change terminal')
            const terminalInfo: TerminalInfo = req.user.getTerminalById(req.query.id.toString());
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

    router.post('/terminal.restart', (req, res) => {
        log('Restarting terminal %o', req.query);
        const terminalInfo: TerminalInfo = req.user.getTerminalById(req.query.id.toString());
        if (terminalInfo != null) {
            const { host, port } = terminalInfo.terminal;
            SocketManager.restart({ host, port, config });
            res.json({ success: true });
            return;
        }
        res.json({ success: false });
    })

    router.get('/terminal.get', (req, res) => {
        log('Getting terminal %o', req.query);
        const info: TerminalInfo = req.user.getTerminalById(req.query.id.toString());
        if(info == null) {
            res.json(null);
            return;
        }
        let result = {
            id: info.terminal._id,
            name: info.terminal.name,
            readonly: info.readonly,
            editable: req.user.admin
        };
        if (req.user.admin) {
            Object.assign(result, {
                host: info.terminal.host,
                port: info.terminal.port
            })
        }
        res.json(result);
    })

    return router;
}

export default init;