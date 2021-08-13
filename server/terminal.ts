import { Schema, model, ObjectId, Document } from 'mongoose';

type ITerminal = {
    name: string,
    host: string,
    port: number,
    serverId: number
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
    }
});

const Terminal = model<ITerminal>("Terminal", terminalSchema);
export default Terminal;

type TerminalType = ITerminal & Document<any, any>;
export type {
    TerminalType as ITerminal
};