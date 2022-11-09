test:
	go clean -testcache && go test ./... -cover

controllers-test:
	go clean -testcache && go test ./controllers

repositories-test:
	go clean -testcache && go test ./repositories

services-test:
	go clean -testcache && go test ./services

usecases-test:
	go clean -testcache && go test ./usecases
