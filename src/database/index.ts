import mongoose, { Mongoose } from 'mongoose';

export const connect = async (): Promise<Mongoose> =>
  await mongoose.connect('mongodb+srv://admin:root@cluster0.pamgw.mongodb.net/test', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

export const close = (): Promise<void> => mongoose.connection.close();


//mongoose.connect('mongodb+srv://admin:root@cluster0.pamgw.mongodb.net/test',  { useNewUrlParser: true, useUnifiedTopology: true });
//mongoose.Promise = global.Promise;


