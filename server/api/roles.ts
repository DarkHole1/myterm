import debug from "debug";
import express, { Router } from "express";
import { z } from "zod";
import Config from "../config";
import { RoleModel } from "../models/role";

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
            return res.json({ success: false })
        }

        const role = await RoleModel.findByIdAndDelete(req.query.id)
        if(!role) {
            return res.json({ success: false })
        }

        return res.json({ success: true })
    })

    return router
}
