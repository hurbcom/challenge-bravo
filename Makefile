MODULE_NAME=$(shell grep ^module go.mod | cut -d " " -f2)
GIT_COMMIT_HASH=$(shell git rev-parse HEAD)
LD_FLAGS=-ldflags="-X $(MODULE_NAME)/internal/config.gitCommitHash=$(GIT_COMMIT_HASH)"

.PHONY: lint
lint:
	@golangci-lint run

.PHONY: api
api:
	@go run $(LD_FLAGS) cmd/api/main.go 

.PHONY: grpc
grpc:
	@go run $(LD_FLAGS) cmd/grpc/main.go 

.PHONY: build
build:
	@go build -o ./bin/api $(LD_FLAGS) ./cmd/api

.PHONY: docker-stop
docker-stop:
	@docker-compose -f ./build/docker-compose.yaml stop

.PHONY: docker
docker:
	@docker-compose -f ./build/docker-compose.yaml up

.PHONY: generate
generate: build-dep
	@go generate ./...

.PHONY: test
test:
	@go test -coverpkg ./... -race -coverprofile coverage.out ./...

.PHONY: cover
cover: test
	@go tool cover -html=coverage.out

.PHONY: stress
stress:
	@k6 run _test/stress/httpload.js

.PHONY: build-dep
build-dep:
	@go install github.com/golang/mock/mockgen@v1.5.0

.PHONY: hot
hot:
	@air	