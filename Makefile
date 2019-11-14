install:
	cp .env.example .env
	docker-compose build

up:
	docker-compose up

seed:
	docker-compose exec hurb-app composer database:seed

test:
	docker-compose exec hurb-app composer test:coverage
