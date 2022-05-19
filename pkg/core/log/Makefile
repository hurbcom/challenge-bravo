.PHONY: lint
lint:
	@golangci-lint run

.PHONY: test
test:
	@go test ./... -coverpkg ./... -race -covermode=atomic -coverprofile=coverage.out

.PHONY: generate
generate: build-dep
	@go generate ./...

.PHONY: build-dep
build-dep:
	@go install github.com/golang/mock/mockgen@v1.5.0	