import { Router } from 'express';
import { TerminalInfo } from './user';
import debug from 'debug';
import SocketManager from './socket-manager';
import Config from './config';
const log = debug('app:api');

function init(config: Config) {
    const router = Router();
    router.get('/terminal.list', (req: any, res) => {
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

    router.post('/terminal.update', (req: any, res) => {
        if (req.user.admin) {
            log('Trying change terminal')
            const terminalInfo: TerminalInfo = req.user.getTerminalById(req.query.id);
            if (terminalInfo != null) {
                const { terminal } = terminalInfo;
                terminal.host = req.query.host;
                terminal.port = req.query.port;
                terminal.name = req.query.name;
                terminal.save();
                log('Changes succesfull');
                res.json({ success: true });
                return;
            }
        }
        res.json({ success: false });
    })

    router.post('/terminal.restart', (req: any, res) => {
        log('Restarting terminal %o', req.query);
        const terminalInfo: TerminalInfo = req.user.getTerminalById(req.query.id);
        if (terminalInfo != null) {
            const { host, port } = terminalInfo.terminal;
            SocketManager.restart({ host, port, config });
            res.json({ success: true });
        }
        res.json({ success: false });
    })

    return router;
}

export default init;