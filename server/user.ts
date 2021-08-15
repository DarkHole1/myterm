import { Schema, model, Model, ObjectId } from 'mongoose';
import Credentials from './credentials';
import { ITerminal } from './terminal';
import './terminal';

type TerminalInfo = {
    terminal: ITerminal,
    readonly: boolean
}

interface IUser {
    name: string,
    admin: boolean
    password: string,
    terminals: TerminalInfo[]

    getTerminalById(id: ObjectId | string): TerminalInfo;
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

userSchema.statics.findByCredentials = function(creds: Credentials) {
    return this
        .findOne(creds.getCredentials())
        .populate({
            path: 'terminals.terminal',
            populate: 'server'
        });
}

userSchema.methods.getTerminalById = function(id: ObjectId | string) {
    for (const terminal of this.terminals) {
        if(terminal.terminal._id == id) {
            return terminal;
        }
    }
    return null;
}

const User = model<IUser, IUserModel>("User", userSchema);
export default User;

export type {
    TerminalInfo, IUser
}