import { getModelForClass, prop, defaultClasses, DocumentType } from "@typegoose/typegoose";

class Role {
    @prop({ required: true })
    public name!: string
}

type RoleDocument = DocumentType<Role>

export type {
    RoleDocument as Role
}

export const RoleModel = getModelForClass(Role)
