import { Schema, model } from 'mongoose';

type ITerminal = {
    name: string,
    host: string,
    port: number
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
    }
});

const Terminal = model<ITerminal>("Terminal", terminalSchema);
export default Terminal;