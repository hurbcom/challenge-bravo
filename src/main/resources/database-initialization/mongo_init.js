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


db.createCollection("exchangedata");
db.exchangedata.insert(
    {
        "last_update": "2023-02-17T18:52:40",
        "rates": []
    }
);

console.log("------------------------------ Finished database initialization -----------------------------------------")