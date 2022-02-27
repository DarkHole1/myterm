import { Schema, model, ObjectId, Document } from 'mongoose';
import { ICOMServer } from './com-server';
import './com-server';

interface AllTerminalData {
    id: string,
    name: string,
    host: string,
    port: number,
    serverName: string,
    comPort: number
} 

type ITerminal = {
    name: string,
    host: string,
    port: number,
    server: ICOMServer,
    permissions: Map<string, {
        show: boolean,
        write: boolean
    }>

    getData(): AllTerminalData;
    getInfo(admin?: boolean): {
        name: string,
        serverName: string,
        host?: string,
        port?: number,
        comPort: number
    };
    visible(role: string): boolean; 
}

const terminalSchema = new Schema<ITerminal>({
    name: {
        type: String,
        required: true
    }, 
    host: {
        type: String,
        required: true
    },
    port: {
        type: Number,
        required: true
    },
    server: {
        type: Schema.Types.ObjectId,
        ref: 'COMServer',
        required: true
    },
    permissions: {
        type: Map,
        of: {
            show: {
                type: Boolean,
                required: true
            },
            write: {
                type: Boolean,
                required: true
            }
        },
        default: {}
    }
});

terminalSchema.methods.getData = function(): AllTerminalData {
    return {
        id: this.id,
        name: this.name,
        host: this.server.host,
        port: this.port,
        serverName: this.server.name,
        comPort: this.port - 20000
    }
}

terminalSchema.methods.getInfo = function(isAdmin: boolean = false) {
    let res = {
        name: this.name,
        host: this.server.host,
        port: this.port,
        serverName: this.server.name,
        comPort: this.port - 20000
    }

    if(!isAdmin) {
        delete res.host;
        delete res.port;
    }

    return res;
}

terminalSchema.methods.visible = function(role: string) {
    if(role in this.permissions) {
        return this.permissions[role].visible;
    }
    return false;
}

const Terminal = model<ITerminal>("Terminal", terminalSchema);
export default Terminal;

type TerminalType = ITerminal & Document;
export type {
    TerminalType as ITerminal
};