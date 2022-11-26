import { Role, RoleDocument, RoleModel } from "../models/role"
import { TerminalModel } from "../models/terminal"
import { UserModel } from "../models/user"
import mongoose from 'mongoose';
import debug from "debug";

const log = debug('script:convert-roles')

const roleMap = new Map<string, RoleDocument>();

log(UserModel.schema);

(async () => {
    log("Connecting to %o", process.argv[2])
    await mongoose.connect(process.argv[2])
    log("Connected!")

    // Fix users
    log("Fetching users...")
    const users = await UserModel.find().lean()
    log("Fetched %d users", users.length)

    for (const user of users) {
        const role = user.role
        log(user)
        if (typeof role != 'string') {
            continue
        }

        const roleDoc = await findOrCreateRole(role)
        user.role = roleDoc._id
        const { _id } = user
        delete user._id 
        await UserModel.updateOne({ _id }, user)
    }

    // Fix terminals
    log("Fetching terminals...")
    const terminals = await TerminalModel.find()
    log("Fetched %d terminals", terminals.length)

    for (const terminal of terminals) {
        for (const [role, permissions] of Array.from(terminal.permissions.entries())) {
            const roleDoc = await findOrCreateRole(role)
            terminal.permissions.delete(role)
            terminal.permissions.set(roleDoc._id, permissions)
        }
        await terminal.save()
    }
})().then(_ => {
    log("Succefully ended")
    // WTF
    process.exit()
}, e => {
    log("An error occured %e", e)
})

async function findOrCreateRole(roleName: string): Promise<RoleDocument> {
    let roleDoc: Option<RoleDocument> = roleMap.get(roleName)
    if (!roleDoc) {
        roleDoc = await RoleModel.findOne({ name: roleName })
    }

    if (!roleDoc) {
        roleDoc = new RoleModel({
            name: roleName
        })
        await roleDoc.save()
    }

    roleMap.set(roleName, roleDoc)
    roleMap.set(roleDoc._id, roleDoc)
    return roleDoc
}

type Option<T> = T | null | undefined
const isJust = <T>(value: Option<T>): value is T => (value != null && value != undefined)
