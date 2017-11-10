DOCKER_CMD=docker exec -it challengebravo_web_1

docker-test-unit:
	${DOCKER_CMD} make test-unit

test-unit:
	node tests/test-server.js