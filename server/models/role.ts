import { getModelForClass, prop, defaultClasses, DocumentType } from "@typegoose/typegoose";

export class Role {
    @prop({ required: true })
    public name!: string
}

export type RoleDocument = DocumentType<Role>
export const RoleModel = getModelForClass(Role)
