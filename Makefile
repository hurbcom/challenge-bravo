DOCKER_CMD=docker exec -it challengebravo_web_1

docker-test:
	${DOCKER_CMD} make test

docker-coverage:
	${DOCKER_CMD} make coverage

docker-flake8:
	${DOCKER_CMD} make flake8

test:
	pytest

coverage:
	pytest --cov=currency_conversion tests/ --cov-branch

flake8:
	flake8 --max-line-length=119
