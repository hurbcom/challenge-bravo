build:
	docker-compose build ${BUILD_TARGETS}

database:
	docker-compose run --rm exchange-rate-service bundle exec rake db:setup

dev:
	@make build
	@make database
	docker-compose up exchange-rate-service rate-converter-service

clean:
	docker-compose down -v

test:
	@make test-exchange-rate
	@make test-rate-converter

test-exchange-rate:
	@make database
	docker-compose run --rm exchange-rate-service-ci

test-rate-converter:
	docker-compose run --rm rate-converter-service-ci
