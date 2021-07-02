#bin/bash

docker container stop $(docker ps -a -q)
docker container rm $(docker ps -a -q)

docker-compose down -v
sudo docker-compose up -d --build
sudo chmod 777 -R postgres

sudo docker-compose exec back gunicorn app.wsgi:application --bind 0.0.0.0:8000
echo "subindo servidor... Aguarde"
