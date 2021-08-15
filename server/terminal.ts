import { Schema, model, ObjectId, Document } from 'mongoose';
import { ICOMServer } from './com-server';

type ITerminal = {
    name: string,
    host: string,
    port: number,
    serverId: number,
    server: ICOMServer
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

const Terminal = model<ITerminal>("Terminal", terminalSchema);
export default Terminal;

type TerminalType = ITerminal & Document;
export type {
    TerminalType as ITerminal
};