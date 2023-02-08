#!/bin/bash

cd /var/www/quotationBatch/scripts
crontab crontab.sh
printenv | grep -v "no_proxy" >> ../.env

# Start cron
echo "Running first..."
./startBatch.sh

echo "Starting cron at $(date "+%H:%M:%S   %d/%m/%y")..."
cron -f