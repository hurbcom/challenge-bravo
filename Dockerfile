FROM golang:1.11-alpine

# node role (worker or api).

ARG role

# custom config when running app as a docker container.

ENV CFGPATH=config/config.docker.json

# copy application into image gopath.

WORKDIR /go/src/github.com/schonmann/challenge-bravo
COPY . .

# get dep.

RUN apk add --no-cache git mercurial \
    && go get github.com/golang/dep/cmd/dep

# ensure vendor folder in correct state and install.

RUN dep ensure

# build and set run command.

RUN go install ./...
RUN go build -o main ./entry/${role}/

# clear image to save space.

RUN apk del git mercurial && rm $GOPATH/bin/dep

CMD ["./main"]