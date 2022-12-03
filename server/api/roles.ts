import debug from "debug";
import express, { Router } from "express";
import { z } from "zod";
import Config from "../config";
import { RoleModel } from "../models/role";
import { TerminalModel } from "../models/terminal";
import { UserModel } from "../models/user";
import Reason from "./reasons";

const log = debug('app:api:roles')

export default function rolesEndpoint(_: Config): Router {
    const router = Router()

    router.get('/role.list', async (_, res) => {
        const roles = await RoleModel.find()
        log('Roles: %o', roles)
        res.json(roles.map(({ _id, name }) => ({ id: _id, name })))
    })

    router.post('/role.rename', async (req, res) => {
        if (!req.user.admin || !req.query.to || !req.query.from) {
            res.json({ success: false })
            return
        }

        const { from, to } = req.query
        const role = await RoleModel.findOne({ name: from })
        if (!role) {
            return res.json({ success: false })
        }

        role.name = to.toString()
        await role.save()

        res.json({ success: true })
    })

    router.post('/role.create', express.json(), async (req, res) => {
        const Body = z.object({ name: z.string() })
        if (!req.user.admin) {
            return res.json({ success: false })
        }

        log("Creating role...")
        try {
            const parsedBody = Body.parse(req.body)
            const role = new RoleModel({ name: parsedBody.name })
            await role.save()
            log("Role created successfully")
            return res.json({ success: true, data: { id: role._id, name: role.name } })
        } catch (e) {
            log("Error occured: %e", e)
            return res.json({ success: false })
        }
    })

    router.delete('/role', async (req, res) => {
        if(!req.user.admin || typeof req.query.id != 'string') {
            return res.json({ success: false, reason: Reason.NotAnAdmin })
        }

        const role = await RoleModel.findById(req.query.id)
        if(!role) {
            return res.json({ success: false, reason: Reason.RoleNotFound })
        }

        const user = await UserModel.findOne({ role: role._id })
        if(user) {
            return res.json({ success: false, reason: Reason.UserWithRole })
        }

        const terminals = await TerminalModel.find()
        for(const terminal of terminals) {
            terminal.permissions.delete(role._id)
            await terminal.save()
        }
        return res.json({ success: true })
    })

    return router
}
