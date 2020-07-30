setup:
	@docker-compose build

run:
	@docker-compose run --service-ports web bash -c "flask run --host 0.0.0.0"