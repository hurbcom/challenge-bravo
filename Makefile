api:
	sanic src.api.app --port=8033 --workers=3
dbu-dev:
	docker-compose down && docker-compose build && docker-compose up
test:
	coverage run --source src -m unittest discover && coverage html
redis:
	docker run --name redis-dev -v $(PWD)/redis-bkp:/data -d -p 6379:6379 redis:alpine
kill-redis:
	docker stop redis-dev && docker rm redis-dev
locust:
	locust -f script/locustfile.py
# cron:
# 	docker build . -t api-cron-dev -f dockerfile/cron.dockerfile && docker run --name cron-dev api-cron-dev:latest
# kill-cron:
# 	docker stop cron-dev && docker rm cron-dev
# docker-locust:
# 	docker build . -t locust-container -f dockerfile/locust.dockerfile && docker run --name locust-dev -p 8089:8089 --add-host="localhost:192.168.2.XX" -d locust-container:latest
# kill-locust:
# 	docker stop locust-dev && docker rm locust-dev