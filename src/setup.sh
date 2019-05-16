#!/bin/sh
clear

echo "Downloading composer... "
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
apt-get update
apt-get install -y openssl zip unzip git libnss3

echo "Installing project dependencies... "
cd /src
composer install
chmod -R 777 /src/api/storage/logs

echo "configuring cron job..."
apt-get install -y cron
echo "* * * * * /src/crontab.sh" > mycron
crontab mycron
rm mycron

/etc/init.d/cron restart

/src/crontab.sh