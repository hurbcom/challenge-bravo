#bin/bash
sudo chmod 777 -R postgres

docker-compose down -v
sudo docker-compose up -d --build
sudo docker-compose up -d
sudo chmod 777 -R postgres
sudo docker-compose exec back gunicorn app.wsgi:application --bind 0.0.0.0:8000
echo "subindo servidor... Aguarde"
