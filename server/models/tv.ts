import { DocumentType, getModelForClass, prop } from "@typegoose/typegoose"

export class TV {
    @prop({ required: true })
    public name!: string

    @prop({ required: true })
    public host!: string

    @prop({ required: true })
    public port!: number

    getInfo(this: TVDocument) {
        return {
            id: this.id as string,
            name: this.name,
            host: this.host,
            port: this.port
        }
    }
}

export type TVDocument = DocumentType<TV>
export const TVModel = getModelForClass(TV)