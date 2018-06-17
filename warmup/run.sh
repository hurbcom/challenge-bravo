#!/bin/sh
curl -i "http://localhost:32787/api/renewcache?code=BRL&force=1"
curl -i "http://localhost:32787/api/renewcache?code=USD&force=1"
curl -i "http://localhost:32787/api/renewcache?code=EUR&force=1"
curl -i "http://localhost:32787/api/renewcache?code=BTC&force=1"
curl -i "http://localhost:32787/api/renewcache?code=ETH&force=1"