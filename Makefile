test:
	go clean -testcache && go test ./...

controllers-test:
	go clean -testcache && go test ./controllers

repositories-test:
	go clean -testcache && go test ./repositories

services-test:
	go clean -testcache && go test ./services

usecases-test:
	go clean -testcache && go test ./usecases

#  ddosify -t http://localhost:8080/conversion?from=USD&to=BRL&amount=1 -n 1000 -d 1 -p HTTP -T 0