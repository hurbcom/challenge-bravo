include .env

.PHONY: up

up:
    docker-compose up -d

.PHONY: down

down:
    docker-compose down

.PHONY: down

logs:
    docker-compose logs -f