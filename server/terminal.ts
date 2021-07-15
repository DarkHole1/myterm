import { Schema, model, ObjectId } from 'mongoose';

type ITerminal = {
    _id: ObjectId,
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

export type {
    ITerminal
};