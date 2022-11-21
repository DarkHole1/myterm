import './com-server';
import { COMServer, COMServerModel } from './com-server';
import { DocumentType, getModelForClass, isDocument, prop, Ref } from '@typegoose/typegoose';

export class Terminal {
    @prop({ required: true })
    public name!: string

    @prop({ required: true })
    public host!: string

    @prop({ required: true })
    public port!: number

    @prop({ ref: () => COMServer, required: true })
    public server!: Ref<COMServer>

    @prop({ required: true })
    public comPort!: number

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

    public getInfo(this: DocumentType<Terminal>, isAdmin: boolean = false, role = '') {
        interface IResult {
            id: any,
            name: string,
            host?: string,
            port?: number,
            readonly: boolean,
            editable: boolean,
            comPort: number,
            serverName: string
        }

        const hostAndServerName = isDocument(this.server) ? {
            host: this.server.host,
            serverName: this.server.name
        } : {
            host: '', serverName: ''
        }
        let res : IResult = {
            id: this.id,
            name: this.name,
            port: this.port,
            readonly: false,
            editable: isAdmin,
            comPort: this.port - 20000,
            ...hostAndServerName
        }

        if (!isAdmin) {
            delete res.host;
            delete res.port;
            if (this.permissions.has(role)) {
                res.readonly = !this.permissions.get(role)?.write;
            } else {
                res.readonly = true;
            }
        }

        return res;
    }

    public visible(this: DocumentType<Terminal>, role: string) {
        if (this.permissions.has(role)) {
            return this.permissions.get(role)?.show;
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
