import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({ //CRREO LO SCHEMA
    name: {
        type: String,
        required: true,
    },
    surname:{
        type: String,
        required: true,
    }
});

const testModel = mongoose.model('Test', testSchema); //CREO IL MODELLO

let test = new testModel({name: "John", surname: "Doe"}) //VARIABILE DI TEST DEL MODELLO 
test.save();
export default testModel; 