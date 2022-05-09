import mongoose from 'mongoose';

const { MONGODB_USER, MONGODB_USER_PASSWORD, MONGODB_HOST, MONGODB_PORT } = process.env;

export class Database {
  public static async connect() {
    try {
      await mongoose.connect(
        `mongodb://${MONGODB_USER}:${MONGODB_USER_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}`,
      );
      console.log('Database connection established!');
    } catch (e) {
      console.log(e);
    }
  }
}
