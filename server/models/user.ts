import { ObjectId } from 'mongoose';
import Credentials from '../credentials';
import { Terminal, TerminalModel } from './terminal';
import { DocumentType, getModelForClass, isDocument, isDocumentArray, prop, Ref, ReturnModelType } from '@typegoose/typegoose';
import { Role, RoleDocument } from './role';

class User {
    @prop({ required: true })
    public name!: string

    @prop({ default: false })
    public admin!: boolean

    @prop({ ref: () => Role, required: true })
    public role: Ref<Role> | string

    @prop({ required: true })
    public password!: string

    @prop({ type: () => [TerminalInfo], default: [] })
    public terminals!: TerminalInfo[]

    public static findByCredentials(this: ReturnModelType<typeof User>, creds: Credentials) {
        return this
            .findOne(creds.getCredentials())
            .populate({
                path: 'terminals.terminal'
            })
            .exec()
    }

    public async getTerminalById(this: DocumentType<User>, id: ObjectId | string) {
        let terminal = await TerminalModel.findById(id);

        if (!terminal) {
            return null
        }

        if (this.admin) {
            return { terminal, readonly: false }
        }

        let readonly = true;
        // For typecheck
        const role2 = (this.role instanceof Role) ? (this.role as RoleDocument)._id : this.role
        if (terminal.permissions.has(role2)) {
            readonly = !terminal.permissions.get(role2)?.write;
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
    comPort: number
}

class TerminalInfo {
    @prop({ ref: () => Terminal, required: true })
    public terminal!: Ref<Terminal>

    @prop({ required: true })
    public readonly!: boolean
}

export type UserDocument = DocumentType<User>
export const UserModel = getModelForClass(User)
