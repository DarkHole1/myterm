import { model, Schema, Document } from "mongoose";

interface ICOMServer {
    name: string,
    host: string,

    getInfo(isAdmin?: boolean): {
        id: string,
        name: string,
        host?: string
    }
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

serverSchema.methods.getInfo = function(isAdmin: boolean = false) {
    let res = {
        id: this.id,
        name: this.name
    }

    if(isAdmin) {
        Object.assign(res, {
            host: this.host
        });
    }
    return res;
}

const COMServer = model<ICOMServer>('COMServer', serverSchema);
export default COMServer;
type ICOMServerType = ICOMServer & Document; 
export type {
    ICOMServerType as ICOMServer
}