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
    password: string,
    terminals: Terminal[]
}

interface IUserModel extends mongoose.Model<null> {
    findByCredentials(creds: Credentials): IUser
}

const userSchema = new mongoose.Schema<IUser, IUserModel>({
    name: String,
    password: String,
    terminals: [{
        name: String,
        host: String,
        port: Number,
        readonly: Boolean
    }]
});

userSchema.statics.findByCredentials = function(creds: Credentials) {
    return this.findOne(creds.getCredentials());
}

const User = mongoose.model<IUser, IUserModel>("User", userSchema);
export default User;