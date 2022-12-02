import { getModelForClass, prop, DocumentType } from "@typegoose/typegoose";

export class Role {
    @prop({ required: true, unique: true })
    public name!: string
}

export type RoleDocument = DocumentType<Role>
export const RoleModel = getModelForClass(Role)
