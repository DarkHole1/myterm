import './com-server';
import { COMServer, COMServerModel } from './com-server';
import { DocumentType, getModelForClass, isDocument, prop, Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { Role, RoleDocument } from './role';

export class Terminal {
    @prop({ required: true })
    public name!: string

    @prop({ required: true })
    public host!: string

    @prop({ required: true })
    public port!: number

    /** @deprecated Don't use server, it's unstable */
    @prop({ ref: () => COMServer, required: true })
    public server!: Ref<COMServer>

    @prop()
    public comPort?: number

    @prop({ type: () => Permission, _id: false, required: true })
    public permissions!: Map<string, Permission>

    public getData(this: DocumentType<Terminal>): AllTerminalData {
        const partial = {
            id: this.id,
            name: this.name,
            port: this.port,
            comPort: this.port - 20000,
        }
        
        if (isDocument(this.server)) {
            return {
                host: this.server.host,
                serverName: this.server.name,
                ...partial
            }
        }

        // This is unreal case probably
        // At least it should 🤔
        return {
            host: '', serverName: '',
            ...partial
        }
    }

    public getInfo(this: DocumentType<Terminal>, isAdmin: boolean = false, role : string | Types.ObjectId | Role) {
        interface IResult {
            id: any,
            name: string,
            host?: string,
            port?: number,
            readonly: boolean,
            editable: boolean,
            comPort: number
        }

        let res : IResult = {
            id: this.id,
            name: this.name,
            port: this.port,
            readonly: false,
            editable: isAdmin,
            comPort: this.port - 20000,
            host: this.host
        }

        if (!isAdmin) {
            delete res.host;
            delete res.port;
            // For typecheck
            const role2 = (role instanceof Role) ? (role as RoleDocument)._id : role
            if (this.permissions.has(role2)) {
                res.readonly = !this.permissions.get(role2)?.write;
            } else {
                res.readonly = true;
            }
        }

        return res;
    }

    public visible(this: DocumentType<Terminal>, role: string | Types.ObjectId | Role) {
        // For typecheck 😿
        const role2 = (role instanceof Role) ? (role as RoleDocument)._id : role
        if (this.permissions.has(role2)) {
            return this.permissions.get(role2)?.show;
        }
        return false;
    }
}

class Permission {
    @prop({ required: true })
    public show!: boolean

    @prop({ required: true })
    public write!: boolean
}

interface AllTerminalData {
    id: string,
    name: string,
    host: string,
    port: number,
    serverName: string,
    comPort: number
}

export type TerminalDocument = DocumentType<Terminal>
export const TerminalModel = getModelForClass(Terminal)
