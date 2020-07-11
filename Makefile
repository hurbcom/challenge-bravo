PKGS := $(shell go list ./... | grep -v dist/)

BIN_DIR=$(shell go env GOPATH)/bin
LINTER=$(BIN_DIR)/golangci-lint
SPEC_BUILDER=$(BIN_DIR)/swag
SPEC_COMPILER=$(BIN_DIR)/statik

DIST_DIR := ./dist

install: lint test api doc ## Call 'make install' or just call 'make' it's same mean

$(LINTER):
	@curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh -s -- -b $(BIN_DIR) v1.27.0

lint: $(LINTER) ## Run lint for source code
	@$(LINTER) run -v

test: ## Run tests
	@go test -v -cover $(PKGS)

api: ## Build the command api
	@CGO_ENABLED=0 go build -v -o $(DIST_DIR)/bin/api cmd/api/main.go

doc: _api-spec-bind ## Build the command doc
	@CGO_ENABLED=0 go build -v -o $(DIST_DIR)/bin/doc cmd/doc/main.go

docker-image-api: ## Build the docker image for command api
	@docker build -t challenge-bravo-api -f platform/docker/api/Dockerfile .

docker-image-doc: ## Build the docker image for command doc
	@docker build -t challenge-bravo-api-doc -f platform/docker/doc/Dockerfile .

$(SPEC_COMPILER):
	@go get -v github.com/rakyll/statik

_api-spec-bind: $(SPEC_COMPILER) api-spec
	@$(SPEC_COMPILER) -src=spec -dest=adapter/primary/http -p static -f

$(SPEC_BUILDER):
	@go get -u github.com/swaggo/swag/cmd/swag

api-spec: $(SPEC_BUILDER) ## Generate Swagger for your API specification into dist folder
	@$(SPEC_BUILDER) init --generalInfo adapter/primary/http/rest/router.go --output spec
	@rm -rf spec/docs.go

help: ## Display available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

