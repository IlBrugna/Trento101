import mongoose from 'mongoose';
const url = 'mongodb+srv://Trento101:iaH59qJrOBkuvbEq@cluster0.syzmwef.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

export const connectDB = async () => {
    try {
        await mongoose.connect(url,{
            //useNewUrlParser: true, // ???
            //useUnifiedTopology: true, // ???
        });
        console.log('MongoDB connesso');
    } catch (err){
        console.log('CONNESSIONE MongoDB NON RIUSCITA');
    }
};

export const disconnectDB = async() => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB disconnesso');
    } catch (err) {
        console.log('DISCONNESSIONE MongoDB NON RIUSCITA');
    }
};