import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

export class DatabaseMemoryServer {
  private static mongo: MongoMemoryServer;

  public static async setup() {
    this.mongo = await MongoMemoryServer.create();
    return new DatabaseMemoryServer();
  }

  public async connect() {
    const uri = DatabaseMemoryServer.mongo.getUri();
    await mongoose.connect(uri);
  }

  public async disconnectAndStop() {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await DatabaseMemoryServer.mongo.stop();
  }

  public async clearDatabase() {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
}
