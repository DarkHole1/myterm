import mongoose from 'mongoose';
import Credentials from './credentials';

type Terminal = {
    name: string,
    host: string,
    port: number,
    readonly: boolean
}

interface IUser {
    name: string,
    admin: boolean
    password: string,
    terminals: Terminal[]
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
            name: {
                type: String,
                required: true,
            },
            host: {
                type: String,
                required: true
            },
            port: {
                type: Number,
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
    return this.findOne(creds.getCredentials());
}

const User = mongoose.model<IUser, IUserModel>("User", userSchema);
export default User;