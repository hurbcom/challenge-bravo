#!/bin/bash
if [[ $ENV == "development" ]]; then
  npm install
  pm2-dev start process.json
else
  pm2-runtime start process.json
fi
