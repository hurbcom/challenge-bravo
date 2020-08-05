setup:
	@docker-compose build

run:
	@docker-compose run --service-ports web

test:
	@docker-compose run web bash -c "python -m unittest discover -s api"

stress:
	@docker-compose run --service-ports performance
