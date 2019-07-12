#!/bin/bash

npm install
pm2-dev start server.config.js --ignore="logs,node_modules"