db.currency.drop();
db.currency.insertMany([
  { _id: 1, type: "USD" },
  { _id: 2, type: "BRL" },
  { _id: 3, type: "EUR" },
  { _id: 4, type: "BTC" },
  { _id: 5, type: "ETH" }
]);
