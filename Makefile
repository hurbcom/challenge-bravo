# =============================================================================
# Makefile
# version 1.0
# author: Rodrigo Cantarino <rodrigopcantarino@gmail.com>
# =============================================================================

# =============================================================================
# DECLARANDO VARIAVEIS
# =============================================================================
include .env

# DEFAULTS
.DEFAULT_GOAL := help

# DOCKERFILE
CONTEXT_DOCKERFILE=./
PATH_DOCKERFILE=./Dockerfile

# CONTAINERS AND DOCKER IMAGES
IMAGES_LIST := $(shell docker images -aq)
DOCKER_CONTAINER_LIST := $(shell docker ps -aq)
DOCKER_EXEC_ON_BRAVO := docker exec -it -w /challenge-bravo/api challenge-bravo

DATA_HORA_INICIO := $(shell date)

# =============================================================================
# MAKE HELP
# =============================================================================
.PHONY: help
help: ## Make help command
	@echo "\033[32m...Comandos disponÃ­veis no Makefile...\033[39m"
	@grep -E '^[a-zA-Z-]+:.*?## .*$$' Makefile | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "[32m%-27s[0m %s\n", $$1, $$2}'

# =============================================================================
# PYTHON TESTS
# =============================================================================
tests-container: ## Execute api tests on container
	@echo "\033[32m...Executa os Testes...\033[39m"
	@docker exec -it -w /challenge-bravo/api challenge-bravo python3 manage.py test

tests-local: ## Execute api local tests
	@echo "\033[32m...Executa os Testes...\033[39m"
	cd api/; python3 manage.py test

# =============================================================================
# PYTHON CLEAN ALL
# =============================================================================

clean: ## Python clean all cache
	find ./ -name "*.pyc" -exec rm --force {} +
	find ./ -name "*.pyo" -exec rm --force {} +
	find ./ -name "__pycache__" -type d -exec rm -r "{}" \;

# =============================================================================
# LOCAL COMMANDS
# =============================================================================
# LOAD
.PHONY: load
load: ## Load local server
	@echo "\33[32mData e hora do inicio: Carregando Servidor de aplicaÃ§Ã£o\33[39m"
	@echo ${DATA_HORA_INICIO}
	@echo "\33[32m===================================\33[39m"

	cd api/; python3 manage.py runserver

# =============================================================================
# DOCKER COMMANDS
# =============================================================================
# UP
.PHONY: up
up: ## Docker UP
	@echo "\33[32mData e hora do inicio: UP CONTAINER\33[39m"
	@echo ${DATA_HORA_INICIO}
	@echo "\33[32m===================================\33[39m"
	docker-compose up

# BUILD
build: ## Docker build
	docker-compose up --build --no-cache

# COMPOSE
compose: ## Docker compose
	docker-compose up --build

# DOWN
down: ## Docker down
	docker-compose down

stop: ## Docker stop container list
	docker stop ${DOCKER_CONTAINER_LIST}

remove:  ## Docker remove containers list
	docker rm ${DOCKER_CONTAINER_LIST}

remove-images: ## Docker remove images
	docker rmi -f ${IMAGES_LIST}

remove-container: ## Docker remove container
	docker rm -f challenge-bravo

enter-container: ## Get in Docker container
	${DOCKER_EXEC_ON_BRAVO} bash
