import { Router } from 'express';
import { TerminalInfo } from './user';
const router = Router();

router.get('/terminal.list', (req: any, res) => {
    res.json(req.user.terminals.map((info: TerminalInfo) => {
        let res = {
            id: info.terminal._id,
            name: info.terminal.name,
            readonly: info.readonly,
            editable: req.user.admin
        };
        if(req.user.admin) {
            Object.assign(res, {
                host: info.terminal.host,
                port: info.terminal.port
            })
        }
        return res;
    }));
})

router.post('/terminal.update', (req, res) => {
    res.json({ success: false });
})

router.post('/terminal.restart', (req, res) => {
    res.json({ success: false });
})

export default router;