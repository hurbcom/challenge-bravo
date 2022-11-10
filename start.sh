#!/bin/bash

DB_ALREADY_SEEDED="db_already_seeded"
if [ ! -e $DB_ALREADY_SEEDED ]; then
    echo "-- Seeding db --"
    go run ./seeds
    touch $DB_ALREADY_SEEDED
fi
./app
