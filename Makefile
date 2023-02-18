swagger-run:
	which swagger || alias swagger='docker run --rm -it  --user $(id -u):$(id -g) -e GOCACHE=/tmp -e GOPATH=$(go env GOPATH):/go -v $HOME:$HOME -w $(pwd) quay.io/goswagger/swagger'

# swagger-install:
# 	which swagger || GO111MODULE=on go get -u github.com/go-swagger/go-swagger/cmd/swagger

# swagger: swagger-install
# 	GO111MODULE=off swagger generate spec -o ./swagger.yaml --scan-models

swagger-check: 
	which swagger || (GO111MODULE=on go get -u github.com/go-swagger/go-swagger/cmd/swagger)

swagger: swagger-check
	GO111MODULE=off swagger generate spec -o ./swagger.yaml --scan-models

.PHONY: swagger swagger-check