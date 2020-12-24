# IT ADDS CANADIAN DOLLAR AS A NEW CURRENCY TO THE APPLICATION
curl -XPOST -H "Content-type: application/json" -d '{"code":"CAD"}' 'localhost:3500/currency' -w " code=%{http_code}"

# IT REMOVES CANADIAN DOLLAR FROM APPLICATION
curl -XDELETE 'localhost:3500/currency/CAD' -w " code=%{http_code}"

# IT CONVERTS 1 DOLLAR TO REAL
curl -XGET 'localhost:3500/currency?from=USD&to=BRL&amount=1' -w " code=%{http_code}"