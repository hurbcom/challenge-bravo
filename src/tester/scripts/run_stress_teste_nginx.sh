#!/bin/bash
echo "STRESS TEST ON NGINX"
wrk -t9 -c1000 -R13000 -d30s "http://nginx:80/go_api/?from=USD&to=eur&amount=56565.2"