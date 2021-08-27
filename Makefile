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