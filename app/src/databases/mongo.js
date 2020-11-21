import { MongoClient } from 'mongodb';
import { env } from '../config';

export default async () => {
    const url = env.mongo.connectionString;
    const mongoClient = new MongoClient(url, {
        useUnifiedTopology: true,
    });

    const connection = await mongoClient.connect();
    
    return connection.db(env.mongo.name);
};