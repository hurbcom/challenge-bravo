#!/bin/bash
echo ""
echo "#######################################"
echo "# STRESS TEST ON NGINX"
echo "#######################################"
echo ""

wrk -t9 -c1000 -R13000 -d30s "http://nginx:3333/converter/?from=USD&to=eur&amount=56565.2"