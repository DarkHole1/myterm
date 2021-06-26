import mongoose from 'mongoose';

interface IUser extends mongoose.Model<null> {
    findByCredentials(creds: Credentials): any
}

const userSchema = new mongoose.Schema({
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

const User: IUser = mongoose.model<null, IUser>("User", userSchema);
export default User;