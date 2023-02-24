DELETE FROM 
    currencies
WHERE
    short_name = 'USD' 
AND 
    rate_usd = 1 
AND 
    reference_date = '2023-02-23T00:00:00Z';

DELETE FROM 
    currencies
WHERE
    short_name = 'EUR' 
AND 
    rate_usd = 0.9384 
AND 
    reference_date = '2023-02-23T00:00:00Z';

DELETE FROM 
    currencies
WHERE
    short_name = 'BRL' 
AND 
    rate_usd = 5.1391 
AND 
    reference_date = '2023-02-23T00:00:00Z';

DELETE FROM 
    currencies
WHERE
    short_name = 'BTC' 
AND 
    rate_usd = 0.000042 
AND 
    reference_date = '2023-02-23T00:00:00Z';

DELETE FROM 
    currencies
WHERE
    short_name = 'ETH' 
AND 
    rate_usd = 0.00060 
AND 
    reference_date = '2023-02-23T00:00:00Z';

