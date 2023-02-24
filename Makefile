swagger-run:
	which swagger || alias swagger='docker run --rm -it  --user $(id -u):$(id -g) -e GOCACHE=/tmp -e GOPATH=$(go env GOPATH):/go -v $HOME:$HOME -w $(pwd) quay.io/goswagger/swagger'

swagger-check: swagger-run
	which swagger || GO111MODULE=on go get -u github.com/go-swagger/go-swagger/cmd/swagger

swagger: swagger-check
	GO111MODULE=off swagger generate spec -o ./swagger.yaml --scan-models

docker-compose-up:
	docker-compose up -d

docker-compose-stop:
	docker-compose stop

docker-build:
	docker build -t hurbcom-currency:latest .

docker-run:
	docker run \
	-p 9000:9000 \
	--net hurbcom-challenge-bravo_hurbcom-network \
	--env SERVER_LOG_JSON_FORMAT=false \
	--env DB_DRIVER=postgres \
	--env DB_DRIVER=postgres \
	--env DB_URL=postgres://userhurbcom:HURBcom123@hurbcom-postgres:5432/db_hurbcom?sslmode=disable \
	--env DB_MIGRATION_URL=file://migration \
	--env CACHE_URL=redis://:@hurbcom-redis:6379/0 \
	hurbcom-currency
	
go-test: 
	go test -v -cover ./...

go-run:
	go run server.go

.PHONY: swagger swagger-check docker-compose-up docker-compose-stop docker-build docker-run go-test go-run