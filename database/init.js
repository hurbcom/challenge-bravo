db = db.getSiblingDB('currencyDB');

const currenciesData = [
    { code: "USD" },
    { code: "BRL" },
    { code: "EUR" },
    { code: "BTC" },
    { code: "ETH" },
];

const exchangeRatesData = [
    { from: "USD", to: "BRL", rate: 5.47 },
    { from: "USD", to: "EUR", rate: 0.92 },
    { from: "USD", to: "BTC", rate: 0.000018 },
    { from: "USD", to: "ETH", rate: 0.00034 },
    { from: "BRL", to: "USD", rate: 0.18 },
    { from: "BRL", to: "EUR", rate: 0.17 },
    { from: "BRL", to: "BTC", rate: 0.0000032 },
    { from: "BRL", to: "ETH", rate: 0.000062 },
    { from: "EUR", to: "USD", rate: 5.47 },
    { from: "EUR", to: "BRL", rate: 0.92 },
    { from: "EUR", to: "BTC", rate: 0.000018 },
    { from: "EUR", to: "ETH", rate: 0.00034 },
    { from: "BTC", to: "USD", rate: 5.47 },
    { from: "BTC", to: "BRL", rate: 0.92 },
    { from: "BTC", to: "EUR", rate: 0.000018 },
    { from: "BTC", to: "ETH", rate: 0.00034 },
    { from: "ETH", to: "USD", rate: 5.47 },
    { from: "ETH", to: "BRL", rate: 0.92 },
    { from: "ETH", to: "EUR", rate: 0.000018 },
    { from: "ETH", to: "BTC", rate: 0.00034 }
];

db.currencies.insertMany(currenciesData);
db.exchangerates.insertMany(exchangeRatesData);

print("Data inserted successfully");
