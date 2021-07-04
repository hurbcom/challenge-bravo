#!/bin/bash

########################################################################

## Shell Script to Build Docker Swarm for the Challenge-Bravo Project ##

########################################################################

# Building the images from docker-compose.yml
docker-compose build

# Starting the swarm
docker-compose up -d
