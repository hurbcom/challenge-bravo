#!/bin/sh
echo "This runs a benchmark for 30 seconds, using 8 threads, keeping 1000 HTTP connections open, and a constant throughput of 6000 requests per second"
wrk -d30s -t8 -c1000 -R6000 "http://nginx/api/convert?from=BTC&to=BRL&amount=1"