import mongoose, { Mongoose } from 'mongoose';

let stringConnectBd = '';

process.env.NODE_ENV === 'test'
?  stringConnectBd = 'mongodb+srv://admin:root@cluster0.pamgw.mongodb.net/test'
: stringConnectBd = 'mongodb+srv://admin:root@cluster0.pamgw.mongodb.net/chBravoDb';

export const connect = async (): Promise<Mongoose> =>
    await mongoose.connect(stringConnectBd, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

export const close = (): Promise<void> => mongoose.connection.close();

export const dropCollection = () : Promise<void> =>  mongoose.connection.dropCollection('Moeda');






