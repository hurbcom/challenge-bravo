module.exports = {
    uri: process.env.MONGODB_ENDPOINT || "mongodb://localhost:27017/currencies",
    options: {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
};
