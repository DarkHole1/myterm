import debug from "debug"
import express, { Router } from "express"
import { z } from "zod"
import Config from "../config"
import { TVModel } from "../models/tv"
import SocketManager from "../socket-manager"
import Reason from "./reasons"
import { hex2u8a } from "./utils"

const COMMANDS = {
    "Power ON": hex2u8a("01 30 41 30 41 30 43 02 43 32 30 33 44 36 30 30 30 31 03 73 0d"),
    "Power OFF": hex2u8a("01 30 41 30 41 30 43 02 43 32 30 33 44 36 30 30 30 34 03 76 0d"),
    "Select VGA": hex2u8a("01 30 41 30 45 30 41 02 30 30 36 30 30 30 30 31 03 73 0d"),
    "Select HDMI-1": hex2u8a("01 30 41 30 45 30 41 02 30 30 36 30 30 30 31 31 03 72 0d"),
    "Select HDMI-2": hex2u8a("01 30 41 30 45 30 41 02 30 30 36 30 30 30 31 32 03 71 0d"),
    "Select HDMI-3": hex2u8a("01 30 41 30 45 30 41 02 30 30 36 30 30 30 31 33 03 70 0d"),
    "Select Component": hex2u8a("01 30 41 30 45 30 41 02 30 30 36 30 30 30 30 43 03 01 0d"),
    "Select Composite": hex2u8a("01 30 41 30 45 30 41 02 30 30 36 30 30 30 30 35 03 77 0d"),
    "Select USB": hex2u8a("01 30 41 30 45 30 41 02 30 30 36 30 30 30 31 34 03 77 0D"),
    "Sound Mute ON": hex2u8a("01 30 41 30 45 30 41 02 30 30 38 44 30 30 30 31 03 09 0d"),
    "Sound Mute OFF": hex2u8a("01 30 41 30 45 30 41 02 30 30 38 44 30 30 30 32 03 0a 0d")
}

const log = debug('app:api:users')
export function tvsEndpoint(config: Config) {
    const router = Router()

    router.get('/tv.list', async (req, res) => {
        if (!req.user.admin) {
            return res.json([])
        }

        log('Starting getting tvs')
        const tvs = await TVModel.find()
        return res.json(tvs.map(tv => tv.getInfo()))
    })

    router.post('/tv.source', express.json(), async (req, res) => {
        if (!req.user.admin) {
            return res.json({ success: false, reason: Reason.NotAnAdmin })
        }

        const RawOptions = z.object({
            id: z.string(),
            source: z.enum(['vga', 'hdmi1', 'hdmi2', 'hdmi3', 'component', 'composite', 'usb'])
        })
        type RawOptions = z.infer<typeof RawOptions>

        const parsedOptions = RawOptions.safeParse(req.body)
        if (!parsedOptions.success) {
            log(parsedOptions.error)
            return res.json({ success: false, reason: Reason.ValidationFailed })
        }

        log('Started changing source')
        const options = parsedOptions.data
        const tv = await TVModel.findById(options.id)
        if (!tv) {
            return res.json({ success: false, reason: Reason.TVNotFound })
        }

        const [socket, _] = SocketManager.get({ host: tv.host, port: tv.port, readonly: false, config })
        let command = new Uint8Array();
        switch (options.source) {
            case 'vga':
                command = COMMANDS["Select VGA"]
                break
            case 'hdmi1':
                command = COMMANDS["Select HDMI-1"]
                break
            case 'hdmi2':
                command = COMMANDS["Select HDMI-2"]
                break
            case 'hdmi3':
                command = COMMANDS["Select HDMI-3"]
                break
            case 'component':
                command = COMMANDS["Select Component"]
                break
            case 'composite':
                command = COMMANDS["Select Composite"]
                break
            case 'usb':
                command = COMMANDS["Select USB"]
                break
        }
        socket.send(command)
        return res.json({ success: true })
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
        const tv = await TVModel.findById(options.id)
        if (!tv) {
            return res.json({ success: false, reason: Reason.TVNotFound })
        }

        const [socket, _] = SocketManager.get({ host: tv.host, port: tv.port, readonly: false, config })
        let command = new Uint8Array
        if(options.mute) {
            command = COMMANDS["Sound Mute ON"]
        } else {
            command = COMMANDS["Sound Mute OFF"]
        }
        socket.send(command)
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
        const tv = await TVModel.findById(options.id)
        if (!tv) {
            return res.json({ success: false, reason: Reason.TVNotFound })
        }

        const [socket, _] = SocketManager.get({ host: tv.host, port: tv.port, readonly: false, config })
        let command = new Uint8Array
        if(options.power) {
            command = COMMANDS["Power ON"]
        } else {
            command = COMMANDS["Power OFF"]
        }
        socket.send(command)
        return res.json({ success: false })
    })

    return router
}