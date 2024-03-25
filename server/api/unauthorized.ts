import express, { Router } from 'express'
import { UserModel } from '../models/user'

export function unauthorizedEndpoint() {
    const router = Router()

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

    return router
}