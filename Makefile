clean:
	docker-compose run node rm -rf node_modules
	docker-compose down

install:
	docker-compose run node yarn install
	docker-compose down

lint:
	docker-compose run node yarn run lint
	docker-compose down

start:
	docker-compose up
