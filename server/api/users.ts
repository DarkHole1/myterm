import { isDocument } from "@typegoose/typegoose";
import debug from "debug";
import express, { Router } from "express";
import { z } from "zod";
import Config from "../config";
import { RoleModel } from "../models/role";
import { UserModel } from "../models/user";
import Reason from "./reasons";

const log = debug('app:api:users')

export function usersEndpoint(config: Config) {
    const router = Router()


    router.get('/user.isAdmin', (req, res) => {
        if (!req.user) {
            res.status(401);
            res.end();
            return;
        }
        res.json(req.user.admin);
    })

    router.get('/user.list', async (req, res) => {
        if (!req.user.admin) {
            return res.json([]);
        }

        log('Starting getting users')
        const users = await UserModel.find().populate('role')
        const mapped = users.map(({ id, role, name }) => {
            if (isDocument(role)) {
                // Bug in typecheck?
                return { id, role: (role as any).name, name }
            }
            return { id, role, name }
        });
        log("Users: %o", mapped);
        res.json(mapped);
        return;
    })

    router.post('/user.update', express.json(), async (req, res) => {
        if (!req.query.id || !req.user.admin) {
            res.json({ success: false })
            return
        }

        const Body = z.object({
            role: z.string().regex(/[0-9a-f]{24}/i),
            password: z.string()
        }).partial()
        type Body = z.infer<typeof Body>

        log("Trying to parse changes %o", req.body)
        const bodyParsedResult = Body.safeParse(req.body)
        if (!bodyParsedResult.success) {
            return res.json({ success: false })
        }

        const bodyParsed = bodyParsedResult.data

        log('Trying change user %s', req.query.id)
        const user = await UserModel.findById(req.query.id.toString())

        if (!user) {
            res.json({ success: false })
            return
        }

        log("Changes: %o", req.body);
        if (bodyParsed.password) {
            user.password = bodyParsed.password
        }
        if (bodyParsed.role) {
            user.role = bodyParsed.role
        }
        await user.save();
        log('Changes in user succesfull');
        res.json({ success: true });
    })

    router.post('/user.login', express.json(), async (req, res) => {
        // console.log("%o", UserModel.schema)
        const user = await UserModel.findOne({
            name: req.body.name,
            password: req.body.password
        })
        if (!user) {
            res.json({ success: false })
            return
        }

        res.cookie('name', req.body.name, {
            sameSite: 'none',
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.cookie('password', req.body.password, {
            sameSite: 'none',
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.json({ success: true })
    })

    router.post('/user.logout', async (req, res) => {
        res.clearCookie('name', {
            sameSite: 'none', secure: true
        });
        res.clearCookie('password', {
            sameSite: 'none', secure: true
        });
        res.end();
    })

    router.post('/user.add', express.json(), async (req, res) => {
        if (!req.user.admin) {
            return res.json({ success: false, reason: Reason.NotAnAdmin })
        }

        const RawOptions = z.object({
            name: z.string(),
            password: z.string(),
            role: z.string(),
            admin: z.boolean().default(false)
        })
        type RawOptions = z.infer<typeof RawOptions>

        const parsedOptions = RawOptions.safeParse(req.body)
        if(!parsedOptions.success) {
            log(parsedOptions.error)
            return res.json({ success: false, reason: Reason.ValidationFailed })
        }

        const options = parsedOptions.data

        const role = await RoleModel.findById(options.role)
        if(!role) {
            return res.json({ success: false, reason: Reason.RoleNotFound })
        }

        log('Creating user')
        const user = new UserModel({
            name: options.name,
            password: options.password,
            role,
            admin: options.admin
        })
        await user.save();
        res.json({ success: true })
    })

    router.delete('/user', async (req, res) => {
        if (!req.user.admin) {
            res.json({ success: false })
            return
        }

        log('Deleting user')
        const user = await UserModel.findById(req.query.id)

        if (!user) {
            res.json({ success: false })
            return
        }

        if (user.admin) {
            res.json({ success: false })
            return
        }

        await user.delete()
        res.json({ success: true })
    })

    return router
}