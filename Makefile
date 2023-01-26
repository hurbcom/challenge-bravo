build:
	docker-compose build ${BUILD_TARGETS}

database:
	docker-compose run --rm exchange-rate-service bundle exec rake db:setup

dev:
	@make build
	@make database
	docker-compose up exchange-rate-service

clean:
	docker-compose down -v

