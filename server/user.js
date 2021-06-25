const mongoose = require('mongoose');

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

module.exports = mongoose.model("User", userSchema);