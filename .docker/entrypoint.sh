#!/bin/sh

npm config set cache /home/node/app/.npm-cache --global

cd /home/node/app

npm run build
npm run db:create
npm run db:seed
npm run dev