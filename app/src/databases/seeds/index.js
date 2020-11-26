import path from 'path';
import { Seeder } from 'mongo-seeding';
import env from '../../config/env';

const config = {
    database: env.mongo.connectionString,
    dropDatabase: true,
    databaseReconnectTimeout: 120000
};
const seeder = new Seeder(config);
const collections = seeder.readCollectionsFromPath(
    path.resolve(`${__dirname}/collections`),
    {
        transformers: [Seeder.Transformers.replaceDocumentIdWithUnderscoreId],
    },
);

seeder.import(collections).then(() => {
    console.log('MongoDB Seeding Success');
}).catch(err => {
    console.log('MongoDB Seeding Error', err);
});