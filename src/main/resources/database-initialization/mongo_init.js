console.log("------------------------------ Starting database initialization -----------------------------------------")

var db = connect("mongodb://root:password@localhost:27017/admin");

db = db.getSiblingDB('quote-service');

db.createUser(
    {
        user: "root",
        pwd: "password",
        roles: [ { role: "readWrite", db: "quote-service" } ]
    }
);



db.createCollection("rates");
db.rates.insertMany(
    [
        {
            "symbol": "USD",
            "toUsd": "1.000000",
            "fromUsd": "1.000000",
            "active": true
        },
        {
            "symbol": "EUR",
            "toUsd": "1.069118",
            "fromUsd": "0.93535",
            "active": true
        },
        {
            "symbol": "BRL",
            "toUsd": "0.193563",
            "fromUsd": "5.166268",
            "active": true
        },
        {
            "symbol": "BTC",
            "toUsd": "24788.461757",
            "fromUsd": "0.000040",
            "active": true
        },
        {
            "symbol": "ETH",
            "toUsd": "1703.121317",
            "fromUsd": "0.00058",
            "active": true
        },
        {
            "symbol": "D&D",
            "toUsd": "1834.000000",
            "fromUsd": "0.000545",
            "active": true
        }
    ]
);

console.log("------------------------------ Finished database initialization -----------------------------------------")