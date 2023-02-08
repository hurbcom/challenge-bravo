#!/bin/bash

cd /var/www/quotationBatch
echo "Running CRON Task at $(date "+%H:%M:%S   %d/%m/%y")" 

npm run start