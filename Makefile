DOCKER_CMD=docker exec -it challengebravo_web_1

docker-test-all:
	${DOCKER_CMD} make test-all

docker-test-unit:
	${DOCKER_CMD} make test-unit

docker-test-integration:
	${DOCKER_CMD} make test-integration

docker-coverage:
	${DOCKER_CMD} make coverage

docker-flake8:
	${DOCKER_CMD} make flake8

test-all:
	pytest

test-unit:
	pytest tests/unit

test-integration:
	pytest tests/integration

coverage:
	pytest --cov=currency_conversion tests/ --cov-branch

flake8:
	flake8 --max-line-length=119
