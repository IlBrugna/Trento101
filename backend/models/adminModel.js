import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    name: { type: String, required: true }
});

adminSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: '30m' });
};

const adminModel = mongoose.model('admins', adminSchema);
export default adminModel;
