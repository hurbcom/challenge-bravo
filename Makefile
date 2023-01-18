build:
	docker-compose build ${BUILD_TARGETS}

dev:
	@make build
	docker-compose up exchange-rate-service
