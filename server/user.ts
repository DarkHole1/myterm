import mongoose from 'mongoose';

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
    return this.find(creds.getCredentials());
}

export default mongoose.model("User", userSchema);