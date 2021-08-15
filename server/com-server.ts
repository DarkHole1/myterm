import { model, Schema } from "mongoose";

interface ICOMServer {
    name: string,
    ip: string
}

const serverSchema = new Schema<ICOMServer>({
    name: {
        type: String,
        required: true
    },
    ip: {
        type: String,
        required: true
    }
});

const COMServer = model<ICOMServer>('COMServer', serverSchema);
export default COMServer;
export type {
    ICOMServer
}