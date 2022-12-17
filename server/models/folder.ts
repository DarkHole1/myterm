import { DocumentType, getModelForClass, prop, Ref } from "@typegoose/typegoose"
import { Terminal } from "./terminal"

export class Folder {
    @prop({ required: true, unique: true })
    public name!: string

    @prop({ ref: () => Terminal, default: [] })
    public terminals!: Ref<Terminal>[]

    public getInfo(this: FolderModel) {
        return {
            id: this._id,
            name: this.name
        }
    }
}

export const FolderModel = getModelForClass(Folder)
export type FolderModel = DocumentType<Folder>