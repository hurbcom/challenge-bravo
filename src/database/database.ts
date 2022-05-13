import mongoose from 'mongoose';

const { MONGODB_HOST, MONGODB_PORT, MONGODB_COLLECTION } = process.env;

export class Database {
  public static async connect() {
    try {
      await mongoose.connect(`mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_COLLECTION}`);
      console.log('Database connection established!');
    } catch (e) {
      console.log(e);
    }
  }
}
