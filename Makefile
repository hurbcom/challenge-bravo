up:
	docker-compose up -d --build

down:
	docker-compose down

stress-test-goapi:
	docker-compose run tester ./run_stress_test_go.sh
	docker-compose stop tester

stress-test-pythonapi:
	docker-compose run tester ./run_stress_test_python.sh
	docker-compose stop tester

stress-test-nginx:
	docker-compose run tester ./run_stress_test_nginx.sh
	docker-compose stop tester

stress-test-all: stress-test-goapi stress-test-pythonapi stress-test-nginx

pythonapi-test:
	docker-compose exec pythonapi pytest
