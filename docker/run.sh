#!/usr/bin/env bash
flyway -locations=filesystem:/tmp/db/migrations/sql/ -url=jdbc:sqlite:/tmp/microservice.db -user= -password=  migrate

/tmp/src/build/micro-service