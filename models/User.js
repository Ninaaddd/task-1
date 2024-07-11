const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    resetPasswordToken: {
        type: String,
        default: '',
    },
    resetPasswordExpires: {
        type: Date,
        default: Date.now,
    },
}, {timestamps: true});

module.exports = mongoose.model("User", UserSchema);