import mongoose, { Mongoose } from 'mongoose';
require('dotenv').config();

let stringConnectBd = '';
;
process.env.NODE_ENV === 'test'
?  stringConnectBd = process.env.MONGODB_REMOTE_TEST
: stringConnectBd = process.env.MONGODB_REMOTE;

export const connect = async (): Promise<Mongoose> =>
    await mongoose.connect(stringConnectBd, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });

export const close = (): Promise<void> => mongoose.connection.close();

export const dropCollection = () : Promise<void> =>  mongoose.connection.dropCollection('Currency');






