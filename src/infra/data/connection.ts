import mongoose from "mongoose";

const connection = () => {
    return mongoose.createConnection(
        process.env.DB_CONNECTION_STRING as string
    );
};

export default connection;
