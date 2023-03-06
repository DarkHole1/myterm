import debug from "debug"
import { Router } from "express"
import { z } from "zod"
import Config from "../config"
import { TVModel } from "../models/tv"
import Reason from "./reasons"

const log = debug('app:api:users')
export function tvsEndpoint(_: Config) {
    const router = Router()

    router.get('/tv.list', async (req, res) => {
        if (!req.user.admin) {
            return res.json([])
        }

        log('Starting getting tvs')
        const tvs = await TVModel.find()
        return res.json(tvs.map(tv => tv.getInfo()));
    })

    router.post('/tv.source', async (req, res) => {
        if (!req.user.admin) {
            return res.json({ success: false, reason: Reason.NotAnAdmin })
        }

        const RawOptions = z.object({
            id: z.string(),
            source: z.enum(['vga', 'hdmi1', 'hdmi2', 'hdmi3', 'component', 'composed', 'usb'])
        })
        type RawOptions = z.infer<typeof RawOptions>

        const parsedOptions = RawOptions.safeParse(req.body)
        if (!parsedOptions.success) {
            log(parsedOptions.error)
            return res.json({ success: false, reason: Reason.ValidationFailed })
        }
        
        log('Started changing source')
        const options = parsedOptions.data
        // TODO: Send data to TV
        return res.json({ success: false, reason: Reason.ImATeapot })
    })

    router.post('/tv.mute', async (req, res) => {
        if (!req.user.admin) {
            return res.json({ success: false, reason: Reason.NotAnAdmin })
        }

        const RawOptions = z.object({
            id: z.string(),
            mute: z.boolean()
        })
        type RawOptions = z.infer<typeof RawOptions>

        const parsedOptions = RawOptions.safeParse(req.body)
        if (!parsedOptions.success) {
            log(parsedOptions.error)
            return res.json({ success: false, reason: Reason.ValidationFailed })
        }

        log('Started changing mute')
        const options = parsedOptions.data
        // TODO
        return res.json({ success: false })
    })

    router.post('/tv.power', async (req, res) => {
        if (!req.user.admin) {
            return res.json({ success: false, reason: Reason.NotAnAdmin })
        }

        const RawOptions = z.object({
            id: z.string(),
            power: z.boolean()
        })
        type RawOptions = z.infer<typeof RawOptions>

        const parsedOptions = RawOptions.safeParse(req.body)
        if (!parsedOptions.success) {
            log(parsedOptions.error)
            return res.json({ success: false, reason: Reason.ValidationFailed })
        }

        log('Started changing power')
        const options = parsedOptions.data
        // TODO
        return res.json({ success: false })
    })

    return router
}