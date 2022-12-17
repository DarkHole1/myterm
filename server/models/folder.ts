import { DocumentType, getModelForClass, prop, Ref } from "@typegoose/typegoose"
import { Terminal } from "./terminal"

export class Folder {
    @prop({ required: true, unique: true })
    public name!: string

    @prop({ ref: () => Terminal, default: [] })
    public terminals!: Ref<Terminal>[]
}

export const FolderModel = getModelForClass(Folder)
export type FolderModel = DocumentType<Folder>

console.log(FolderModel.schema.obj)