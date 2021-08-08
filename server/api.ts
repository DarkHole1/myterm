import { Router } from 'express';
const router = Router();

router.get('terminal.list', (req, res) => {
    res.json([1, 2, 3]);
})

router.post('terminal.update', (req, res) => {
    res.json({ success: false });
})

router.post('terminal.restart', (req, res) => {
    res.json({ success: false });
})

export default router;