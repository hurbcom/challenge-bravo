#!/bin/bash
echo ""
echo "#######################################"
echo "# STRESS TEST ON PYTHON API"
echo "#######################################"
echo ""

wrk -t9 -c1000 -R13000 -d30s "http://pythonapi:8888/converter/?from=USD&to=eur&amount=56565.2"