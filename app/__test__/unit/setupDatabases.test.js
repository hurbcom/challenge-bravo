import sinon from 'sinon';
import * as redis from 'redis';
import redisMock from 'redis-mock';
import redisConnect from '../../src/databases/redis';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

before(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri);

    sinon.stub(redis, 'createClient').callsFake(() => redisMock.createClient());

    await redisConnect();
});

after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});