.EXPORT_ALL_VARIABLES:

## Vars
IMAGE=curapi
TAG=latest
PKG := challenge-bravo
PKG_LIST := $(shell go list ${PKG}/... | grep -v /vendor/)
GO_FILES := $(shell find . -name '*.go' | grep -v /vendor/ | grep -v _test.go)

ifndef HOST_PORT
  HOST_PORT=8080
endif

ifndef TIMEOUT
  TIMEOUT=30
endif

## Colors
ifdef NO_COLORS
PURPLE:=
RED:=
GREEN:=
NO_COLOR:=
CYAN:=
else
PURPLE:=\\033[1;35m
RED:=\\033[1;31m
CYAN:=\\033[1;96m
GREEN:=\\033[1;32m
NO_COLOR:=\\033[0m
endif

# HELP
.PHONY: help

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help

test: ## Run Go unit tests
	@go test -short ${PKG_LIST}

build: ## Build Docker image for service
	docker build -f Dockerfile -t $(IMAGE):$(TAG) .

run-dev: ## Run Docker image in Development environment
	@echo "\n${GREEN} Running Docker image in development environment.. ${NO_COLOR}\n"
	@HOST_PORT=$(HOST_PORT) TIMEOUT=${TIMEOUT} docker run -p ${HOST_PORT}:8080 -it ${IMAGE}:${TAG} /curapi -d -t ${TIMEOUT}

run-live: ## Run service in Development environment with live reload
	@echo "\n${GREEN} Running service in local environment.. ${NO_COLOR}\n"
	@HOST_PORT=$(HOST_PORT) docker-compose up

stop-live: ## Stop service in Development environment with live reload
	@echo "\n${GREEN} Stopping service in local environment.. ${NO_COLOR}\n"
	@docker-compose down

run: ## Run Docker image in Production environment
	@echo "\n${GREEN} Running Docker image in production environment.. ${NO_COLOR}\n"
	@HOST_PORT=$(HOST_PORT) docker run -p ${HOST_PORT}:8080 -it ${IMAGE}:${TAG} /curapi -t ${TIMEOUT}