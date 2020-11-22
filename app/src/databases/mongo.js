import mongoose from 'mongoose';
import { env } from '../config';
const config = env.mongo; 

export default async () => {
    const url = config.connectionString;

    await mongoose.connect(
        url, 
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        }
    );
};