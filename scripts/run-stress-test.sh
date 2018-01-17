#! /bin/sh
wrk -t9 -c1000 -R13000 -d30s "http://currency-convert:8000/convert?from=BRL&to=EUR&amount=359.99"
