import { Router } from 'express';
import { TerminalInfo } from './user';
import debug from 'debug';
const router = Router();
const log = debug('app:api');

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

router.post('/terminal.restart', (req, res) => {
    res.json({ success: false });
})

export default router;