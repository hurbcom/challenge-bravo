setup:
	@docker-compose build

run:
	@docker-compose run --service-ports web bash -c "flask run --host 0.0.0.0"

test:
	@docker-compose run web bash -c "python -m unittest discover -s api"
