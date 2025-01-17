import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    accountType: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    verificationCode: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

export default User;