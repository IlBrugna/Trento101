import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({path:'./config/.env'});

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL,{
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
        process.exit(0)
    } catch (err) {
        console.log('DISCONNESSIONE MongoDB NON RIUSCITA');
        process.exit(0)
    }
};