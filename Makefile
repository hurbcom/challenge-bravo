run:
	docker-compose up -d --build

down:
	docker-compose down

stress-test-goapi:
	docker-compose run tester ./run_stress_teste_go.sh

stress-test-pythonapi:
	docker-compose run tester ./run_stress_teste_python.sh

stress-test-nginx:
	docker-compose run tester ./run_stress_teste_go.sh