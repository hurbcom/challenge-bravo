INSERT INTO currency
(name, code, usd_exchange_rate, search_url, response_path_to_rate, created_by, updated_by)
VALUES
('Dollar', 'USD', 1, 'https://api.exchangerate-api.com/v4/latest/USD', 'rates;USD', 1, 1),
('Real', 'BRL', 1, null, null, 1, 1),
('Euro', 'EUR', 1, null, null, 1, 1),
('Bitcoin', 'BTC', 1, 'https://api.coindesk.com/v1/bpi/currentprice.json', 'bpi;USD;rate_float', 1, 1),
('Ethereum', 'ETH', 1, 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd', 'ethereum;usd', 1, 1);