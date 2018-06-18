up:
	@ID=$(shell id -u) docker-compose up -d --build

run_benchmark:
	@docker-compose run benchmark ./run.sh

tests:
	@./src/vendor/bin/phpunit --configuration src/phpunit.xml

show_host:
	@ID=$(shell id -u) docker-compose port nginx 80 | sed -e 's/0\.0\.0\.0/http\:\/\/localhost/g'

down:
	docker-compose down