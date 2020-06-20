const config = {
    db: {
        // url: 'mongodb+srv://turbbo:q1w2e3@turbbo-ihobx.mongodb.net/netrifa?retryWrites=true&w=majority',
        url: 'mongodb://104.248.85.161:27017/testehurb',
        options: {
            db: { native_parser: true },
            server: {
                auto_reconnect: true
            }
        }
    },
};

module.exports = config;