import { getModelForClass, prop, defaultClasses, DocumentType } from "@typegoose/typegoose";

class Role {
    @prop()
    public name: string
}

type RoleDocument = DocumentType<Role>

export type {
    RoleDocument as Role
}

export const RoleModel = getModelForClass(Role)
