import { Schema, model, Model, ObjectId } from 'mongoose';
import Credentials from '../credentials';
import { Terminal, TerminalModel } from './terminal';
import './terminal';
import { DocumentType, getModelForClass, isDocument, isDocumentArray, prop, Ref, ReturnModelType } from '@typegoose/typegoose';

class User {
    @prop({ required: true })
    public name!: string

    @prop({ default: false })
    public admin!: boolean

    @prop({ required: true })
    public role!: string

    @prop({ required: true })
    public password!: string

    @prop({ type: () => [TerminalInfo], default: [] })
    public terminals!: TerminalInfo[]

    public static findByCredentials(this: ReturnModelType<typeof User>, creds: Credentials) {
        return this
            .findOne(creds.getCredentials())
            .populate({
                path: 'terminals.terminal',
                populate: 'server'
            })
    }

    public async getTerminalById(this: DocumentType<User>, id: ObjectId | string) {
        let terminal = await TerminalModel.findById(id).populate('server');

        if (!terminal) {
            return null
        }

        if (this.admin) {
            return { terminal, readonly: false }
        }

        let readonly = true;
        if (terminal.permissions.has(this.role)) {
            readonly = !terminal.permissions.get(this.role)?.write;
        }
        return { terminal, readonly }
    }

    public getTerminalsData(this: DocumentType<User>): AllTerminalData[] {
        if (!isDocumentArray(this.terminals)) {
            return []
        }

        return this.terminals.map(terminal => {
            if (!isDocument(terminal.terminal)) {
                // FIXME: There should be more conventional way to do this
                return {} as AllTerminalData
            }

            let res: AllTerminalData = {
                ...terminal.terminal.getData(),
                readonly: terminal.readonly
            }

            if (!this.admin) {
                delete res.host
                delete res.port
            }
            return res
        })
    }
}

interface AllTerminalData {
    name: string,
    host?: string,
    port?: number,
    readonly: boolean,
    serverName: string,
    comPort: number
}

class TerminalInfo {
    @prop({ ref: () => Terminal, required: true })
    public terminal!: Ref<Terminal>

    @prop({ required: true })
    public readonly!: boolean
}

type UserDocument = DocumentType<User>
export {
    UserDocument as User
}

export const UserModel = getModelForClass(User)
