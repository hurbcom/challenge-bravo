import mongoose from 'mongoose';

async function connectWithMongoDB() {
  try {
    await mongoose.connect(
      'mongodb://root:password@localhost:27017/bravodb?authSource=admin',
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
