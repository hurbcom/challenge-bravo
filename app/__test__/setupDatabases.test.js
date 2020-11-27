import sinon from 'sinon';
import chai, { assert } from 'chai';
import * as redis from 'redis';
import redisMock from 'redis-mock';
import Redis from '../src/databases/redis';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { seed } from '../src/databases/seeds/index';

let mongoServer;
let createClientStub;

before(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri);

    seed(mongoUri);

    createClientStub = sinon.stub(redis, 'createClient').callsFake(() => redisMock.createClient());

    Redis.instance;
});

describe('Redis in memory instance',() => {
    it('should call createClient stub function', () => {
        assert(createClientStub.calledOnce, true);
    });
});

after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});