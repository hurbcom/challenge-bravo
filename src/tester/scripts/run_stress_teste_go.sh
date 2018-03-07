#!/bin/bash
echo "STRESS TEST ON GO API"
wrk -t9 -c1000 -R13000 -d30s "http://goapi:8000/converter/?from=USD&to=eur&amount=56565.2"