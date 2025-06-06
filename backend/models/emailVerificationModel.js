import mongoose from 'mongoose';

const emailVerificationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true
    },
    code: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600 //SCADENZA DOCUMENTO (10 MIN)
    },
    verified: {
        type: Boolean,
        default: false
    }
});

const emailVerificationModel = mongoose.model('emailVerifications', emailVerificationSchema);
export default emailVerificationModel;