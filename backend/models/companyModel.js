import mongoose from 'mongoose';

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
    }
});

const companyModel = mongoose.model('companies', companySchema); //CREO IL MODELLO DELLE COMPANY
export default companyModel; 