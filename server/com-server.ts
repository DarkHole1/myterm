import { model, Schema, Document } from "mongoose";

interface ICOMServer {
    name: string,
    host: string
}

const serverSchema = new Schema<ICOMServer>({
    name: {
        type: String,
        required: true
    },
    host: {
        type: String,
        required: true
    }
});

const COMServer = model<ICOMServer>('COMServer', serverSchema);
export default COMServer;
type ICOMServerType = ICOMServer & Document; 
export type {
    ICOMServerType as ICOMServer
}