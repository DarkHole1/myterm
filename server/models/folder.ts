import { DocumentType, getModelForClass, prop, Ref } from "@typegoose/typegoose"
import { Terminal } from "./terminal"

export class Folder {
    @prop({ required: true })
    public name!: string

    @prop({ type: () => Terminal, default: [] })
    public terminals!: Ref<Terminal>[]
}

export const FolderModel = getModelForClass(Folder)
export type FolderModel = DocumentType<Folder>