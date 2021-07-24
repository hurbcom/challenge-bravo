import mongoose from 'mongoose';

import { AppError } from '@errors/AppError';

async function connectWithMongoDB() {
  try {
    if (
      !process.env.MONGODB_USER ||
      !process.env.MONGODB_PASSWORD ||
      !process.env.MONGODB_DATABASE ||
      !process.env.MONGODB_HOST ||
      !process.env.MONGODB_PORT
    ) {
      console.error(
        'MongoDB (bravodb) |'.red,
        'Environment variables are missing.',
      );
      throw new AppError('Environment variables are missing.', 500);
    }

    await mongoose.connect(
      `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}?authSource=admin`,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
      },
    );

    console.log(
      'MongoDB (bravodb) |'.blue,
      'Connection has been established successfully.',
    );
  } catch (error) {
    console.error(
      'MongoDB (bravodb) |'.red,
      'Unable to connect to the MongoDB database\n',
      error,
    );
  }
}

export default connectWithMongoDB();
