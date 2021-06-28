#bin/bash
#sudo chmod 777 -R postgres
docker container stop $(docker ps -a -q)
docker container rm $(docker ps -a -q)

docker-compose down -v
sudo docker-compose up -d --build

#sudo docker-compose -f docker-compose back python3.9 manage.py collectstatic
#sudo docker-compose back python3.8 manage.py migrate
#sudo docker-compose exec back python3.9 manage.py createsuperuser
#sudo docker-compose exec back gunicorn app.wsgi:application --bind 0.0.0.0:8000
echo "subindo servidor... Aguarde"
