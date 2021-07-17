import { Schema, model, Model, ObjectId } from 'mongoose';
import Credentials from './credentials';
import { ITerminal } from './terminal';

// Need model to be build before use
require('./terminal');

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

interface IUserModel extends Model<null> {
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
    return this.findOne(creds.getCredentials()).populate('terminals.terminal');
}

const User = model<IUser, IUserModel>("User", userSchema);
export default User;

export type {
    TerminalInfo
}