import mongoose from "mongoose";

mongoose.connect("mongodb://mongodb:27017",  { useNewUrlParser: true });

let db = mongoose.connection;

export default db;