#bin/bash
sudo chmod 777 -R postgres
#docker container stop $(docker ps -a -q) && docker container rm $(docker ps -a -q)
docker-compose build
docker-compose up -d