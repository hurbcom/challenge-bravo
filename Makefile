lint:
	black . --line-length 79 -t py37 --skip-string-normalization
	isort . --multi-line=3 --trailing-comma --force-grid-wrap=0 --use-parentheses --line-width=88 -l 79

test-cov:
	pytest -x --cov=app --cov-report=term-missing --cov-report=xml --cov-fail-under=80 --junitxml=report.xml --disable-warnings  --cov-config=.coveragerc

build: ## Build this project
	docker-compose build

down: ## Stop and remove all containers
	docker-compose down

up: ## Up all containers
	docker-compose up -d

stress_tests:  ## Run stress tests ex: docker-compose run --service-ports -e --rm api bash -c "locust -f app/tests/stress_tests/locustfile.py --host http://127.0.0.1:8000"
	docker-compose run --service-ports -e --rm api bash -c "locust -f app/tests/stress_tests/locustfile.py --headless -u 1000 -r 17 --run-time 1m --host http://127.0.0.1:8000"