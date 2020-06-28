!/bin/sh
artillery quick --count 100 -n 10 http://localhost:3000/exchange\?from\=usd\&to\=brl\&ammount\=1
