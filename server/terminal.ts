import { Schema, model, ObjectId, Document } from 'mongoose';
import { ICOMServer } from './com-server';
import './com-server';

interface AllTerminalData {
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
    server: {
        type: Schema.Types.ObjectId,
        ref: 'COMServer',
        required: true
    }
});

terminalSchema.methods.getData = function(): AllTerminalData {
    return {
        name: this.name,
        host: this.server.host,
        port: this.port,
        serverName: this.server.name,
        comPort: this.port - 20000
    }
}

const Terminal = model<ITerminal>("Terminal", terminalSchema);
export default Terminal;

type TerminalType = ITerminal & Document;
export type {
    TerminalType as ITerminal
};