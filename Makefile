.PHONY: api
api:
	@go run cmd/api/main.go 

.PHONY: build
build:
	@go build ./cmd/api

.PHONY: docker-stop
docker-stop:
	@docker-compose stop

.PHONY: docker
docker: env
	@docker-compose up

.PHONY: test
test:
	@go test -coverpkg ./... -race ./...

.PHONY: env
env:
	export $(cat env/application.env | xargs)