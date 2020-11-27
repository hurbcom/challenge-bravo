process.env.DEBUG = 'mongo-seeding';
const path = require('path');
const { Seeder } = require('mongo-seeding');
const dotenv = require('dotenv');
dotenv.config();

const config = {
    database: process.env.MONGO_URL,
    databaseReconnectTimeout: 120000
};
const seeder = new Seeder(config);
const collections = seeder.readCollectionsFromPath(
    path.resolve(`${__dirname}/collections`)
);

seeder.import(collections).then(() => {
    console.log('MongoDB Seeding Success');
}).catch(err => {
    if (err.code == 11000) return; // duplication error
    console.log('MongoDB Seeding Error', err);
});