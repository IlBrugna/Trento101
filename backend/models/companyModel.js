import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const companySchema = new mongoose.Schema({ //CREO SCHEMA COMPANY
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber:{
        type: String,
        required: true,
        unique: true,
    },
    address:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    website:{
        type: String,
        required: false,
    },
    picture:{
        type: String,
        required: false,
    },
    password: {
            type: String,
            required: "Your password is required",
            select: false, //COSì NON VIENE RITORNATO NELLA RISPOSTA
            max: 25,
        },
});

companySchema.methods.generateAuthToken = function () { //CREO IL TOKEN
    const token = jwt.sign({ _id: this._id }, //PAYLOAD
    process.env.JWT_SECRET, //SEGRETO
    { expiresIn: '30m' }); //DURATA DEL TOKEN (VALIDITà)
    return token;
};

const companyModel = mongoose.model('companies', companySchema); //CREO IL MODELLO DELLE COMPANY
export default companyModel; 