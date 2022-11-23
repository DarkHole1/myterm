import { Role, RoleDocument, RoleModel } from "../../models/role"
import { TerminalModel } from "../../models/terminal"
import { UserModel } from "../../models/user"
import mongoose from 'mongoose';

const roleMap = new Map<string, RoleDocument>();

(async () => {
    console.log(process.argv[1])
    mongoose.connect(process.argv[1])

    // Fix users
    const users = await UserModel.find()

    for (const user of users) {
        const role = user.role
        if (typeof role != 'string') {
            continue
        }

        const roleDoc = await findOrCreateRole(role)
        user.role = roleDoc._id
        user.save()
    }

    // Fix terminals
    const terminals = await TerminalModel.find()

    for (const terminal of terminals) {
        for (const [role, permissions] of terminal.permissions.entries()) {
            if (typeof role != 'string') {
                continue
            }

            const roleDoc = await findOrCreateRole(role)
            terminal.permissions.delete(role)
            terminal.permissions.set(roleDoc._id, permissions)
            terminal.save()
        }
    }
})()

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
    return roleDoc
}

type Option<T> = T | null | undefined
const isJust = <T>(value: Option<T>): value is T => (value != null && value != undefined)
