swagger-run:
	which swagger || alias swagger='docker run --rm -it  --user $(id -u):$(id -g) -e GOCACHE=/tmp -e GOPATH=$(go env GOPATH):/go -v $HOME:$HOME -w $(pwd) quay.io/goswagger/swagger'

swagger-check: swagger-run
	which swagger || GO111MODULE=on go get -u github.com/go-swagger/go-swagger/cmd/swagger

swagger: swagger-check
	GO111MODULE=off swagger generate spec -o ./swagger.yaml --scan-models

docker-compose-up:
	docker-compose up -d

go-test: 
	go test -v -cover ./...

go-run:
	go run server.go

.PHONY: swagger swagger-check docker-compose-up go-test go-run