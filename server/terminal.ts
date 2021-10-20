import { Schema, model, ObjectId, Document } from 'mongoose';
import { ICOMServer } from './com-server';
import './com-server';

interface AllTerminalData {
    id: string,
    name: string,
    host: string,
    port: number,
    serverName: string,
    serverId: number
} 

type ITerminal = {
    name: string,
    host: string,
    port: number,
    serverId: number,
    server: ICOMServer

    getData(): AllTerminalData;
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
    serverId: {
        type: Number,
        required: true,
        default: 1
    },
    server: {
        type: Schema.Types.ObjectId,
        ref: 'COMServer',
        required: true
    }
});

terminalSchema.methods.getData = function(): AllTerminalData {
    return {
        id: this.id,
        name: this.name,
        host: this.server.host,
        port: this.port,
        serverName: this.server.name,
        serverId: this.serverId
    }
}

const Terminal = model<ITerminal>("Terminal", terminalSchema);
export default Terminal;

type TerminalType = ITerminal & Document;
export type {
    TerminalType as ITerminal
};