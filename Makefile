clean:
	docker-compose run node rm -rf node_modules
	docker-compose down

down:
	docker-compose down

install:
	docker-compose run node yarn install
	make down

lint:
	docker-compose run node yarn run lint
	make down

test:
	docker-compose run node yarn run test
	make down

test-unit:
	docker-compose run node yarn run test-unit
	make down

test-system:
	docker-compose run node yarn run test-system
	make down

start:
	docker-compose up
