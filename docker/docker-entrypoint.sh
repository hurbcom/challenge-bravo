#!/bin/sh

yarn
yarn knex migrate:latest --knexfile ./src/knexfile.ts
yarn knex seed:run --knexfile ./src/knexfile.ts
yarn dev