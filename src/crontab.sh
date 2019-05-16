#!/bin/sh
export $(grep -v '^#' /src/.env | xargs) && /usr/local/bin/php /src/api/artisan schedule:run