import { Schema, model, Model, ObjectId } from 'mongoose';
import Credentials from '../credentials';
import Terminal, { ITerminal } from './terminal';
import './terminal';

interface AllTerminalData {
    name: string,
    host?: string,
    port?: number,
    readonly: boolean,
    serverName: string,
    comPort: number
}

type TerminalInfo = {
    terminal: ITerminal,
    readonly: boolean
}

interface IUser {
    name: string,
    admin: boolean,
    role: string,
    password: string,
    terminals: TerminalInfo[]

    getTerminalById(id: ObjectId | string): Promise<TerminalInfo>;
    getTerminalsData(): AllTerminalData[];
}

interface IUserModel extends Model<IUser> {
    findByCredentials(creds: Credentials): Promise<IUser>
}

const userSchema = new Schema<IUser, IUserModel>({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'user'
    },
    terminals: {
        type: [{
            terminal: {
                type: Schema.Types.ObjectId,
                ref: 'Terminal',
                required: true
            },
            readonly: {
                type: Boolean,
                default: true
            }
        }],
        default: (): [] => []
    }
});

userSchema.statics.findByCredentials = function (creds: Credentials) {
    return this
        .findOne(creds.getCredentials())
        .populate({
            path: 'terminals.terminal',
            populate: 'server'
        });
}

userSchema.methods.getTerminalById = async function (id: ObjectId | string) {
    let terminal = await Terminal.findById(id).populate('server');
    
    if(!terminal) {
        return null
    }

    if(this.admin) {
        return { terminal, readonly: false} 
    }

    let readonly = true;
    if(terminal.permissions.has(this.role)) {
        readonly = !terminal.permissions.get(this.role).write;
    }
    return { terminal, readonly }
}

userSchema.methods.getTerminalsData = function (): AllTerminalData[] {
    const user = this as IUser;
    return user.terminals.map(terminal => {
        let res = {
            ...terminal.terminal.getData(),
            readonly: terminal.readonly
        };
        if (!this.admin) {
            delete res.host;
            delete res.port;
        }
        return res;
    });
}

const User = model<IUser, IUserModel>("User", userSchema);
export default User;

export type {
    TerminalInfo, IUser
}