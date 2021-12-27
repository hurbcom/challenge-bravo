#!/bin/bash

# Building the images from docker-compose.yml
docker-compose -f ./deployments/docker-compose.yml build

# Start the server
docker-compose -f ./deployments/docker-compose.yml up -d