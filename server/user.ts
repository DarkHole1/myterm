import mongoose, { Schema } from 'mongoose';
import Credentials from './credentials';
import type { ITerminal } from './terminal';

type TerminalInfo = {
    terminal: ITerminal,
    readonly: boolean
}

interface IUser {
    name: string,
    admin: boolean
    password: string,
    terminals: TerminalInfo[]
}

interface IUserModel extends mongoose.Model<null> {
    findByCredentials(creds: Credentials): IUser
}

const userSchema = new mongoose.Schema<IUser, IUserModel>({
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

const User = mongoose.model<IUser, IUserModel>("User", userSchema);
export default User;