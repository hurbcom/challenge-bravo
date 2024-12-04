#!/bin/sh
# run_command.sh

crond -f && \
echo "Sync Currencies" >> /var/log/cron.log 2>&1 && \
./challenge-bravo -sync