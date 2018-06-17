up:
	@ID=$(shell id -u) docker-compose up -d --build

run_benchmark:
	@docker-compose run benchmark ./run.sh