db.createCollection('currencies', { capped: false });
db.currencies.insert([
    {'code': 'ABC', 'usd_backing_rate': 0.5, 'created_in': '2022-06-01 13:12:01', 'currency_name': 'ABC'},
])