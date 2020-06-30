#!/bin/sh
artillery quick --count 10 -n 100 http://localhost:3000/exchange\?from\=usd\&to\=brl\&ammount\=1
