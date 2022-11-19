import { DocumentType, getModelForClass, prop } from "@typegoose/typegoose";
import { model, Schema, Document } from "mongoose";

interface TerminalInfo {
    id: any
    name: string
    host?: string
}

export class COMServer {
    @prop()
    public name: string

    @prop()
    public host: string

    public getInfo(this: DocumentType<COMServer>, isAdmin?: boolean): TerminalInfo {
        let res: TerminalInfo = {
            id: this.id,
            name: this.name
        }

        if (isAdmin) {
            res.host = this.host
        }

        return res;
    }
}

export const COMServerModel = getModelForClass(COMServer)
