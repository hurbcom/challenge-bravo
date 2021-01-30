const mongoose = require("mongoose");
const { MONGO_PORT, MONGO_HOST, MONGO_CURRENCY_COLLECTION } = process.env;

//Grants unique initilization any start point of the program
let initalized = false;

const connect = () => {
    if (initalized) {
        return;
    }
    initalized = true;
    mongoose
        .connect(
            `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_CURRENCY_COLLECTION}`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        )
        .then(() => {
            console.log("MongoDB Conectado");
        })
        .catch((error) => {
            console.error(error);
        });
}

module.exports = { connect };