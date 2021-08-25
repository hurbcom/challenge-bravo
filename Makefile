api:
	sanic src.api.app --port=8033
dbu-dev:
	docker-compose down && docker-compose build && docker-compose up
test:
	coverage run --source src -m unittest discover && coverage html
redis:
	docker run --name redis-dev -v $(PWD)/redis-bkp:/data -d -p 6379:6379 redis:alpine
kill-redis:
	docker stop redis-dev && docker rm redis-dev
cron:
	docker build . -t api-cron-dev -f cron.dockerfile && docker run --name cron-dev api-cron-dev:latest
kill-cron:
	docker stop cron-dev && docker rm cron-dev