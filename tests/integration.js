require('dotenv').config();
const newman = require('newman');
const Configuration = require('../src/config/config');

const port = process.env.PORT || Configuration.DEFAULT_PORT;
const host = process.env.HOST || Configuration.DEFAULT_HOST;

newman.run(
    {
        collection: require('../bravo.postman_collection.json'),
        reporters: 'cli',
        environment: {
            id: '4454509f-00c3-fd32-d56c-ac1537f31415',
            name: 'environment',
            values: [
                {
                    key: 'port',
                    value: port,
                    type: 'text',
                    enabled: true,
                },
                {
                    key: 'host',
                    value: host,
                    type: 'text',
                    enabled: true,
                },
            ],
        },
    },
    function (err, summary) {
        if (err) {
            throw err;
        }
    }
);
