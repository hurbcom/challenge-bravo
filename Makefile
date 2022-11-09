test:
	go clean -testcache && go test ./... -cover

controllers-test:
	go clean -testcache && go test ./controllers -cover

repositories-test:
	go clean -testcache && go test ./repositories -cover

services-test:
	go clean -testcache && go test ./services -cover

usecases-test:
	go clean -testcache && go test ./usecases -cover

linter:
	golangci-lint run