const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    profileImage: { type: String, default: '', trim: true },
    password: { type: String, required: true, select: false },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.__v;
            return ret;
        },
    },
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
