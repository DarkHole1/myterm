import debug from "debug"
import express, { Router } from "express"
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
        // return res.json(tvs.map(tv => tv.getInfo()));
        return res.json([{
            id: '000',
            name: 'hello',
            host: '127.0.0.1',
            port: 999
        }])
    })

    router.post('/tv.source', express.json(), async (req, res) => {
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

    router.post('/tv.mute', express.json(), async (req, res) => {
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

    router.post('/tv.power', express.json(), async (req, res) => {
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