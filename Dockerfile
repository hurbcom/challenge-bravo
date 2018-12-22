FROM golang:1.11-alpine

# node role (worker or api).

ARG role

# custom config when running app as a docker container.

ENV CFGPATH=config/config.docker.json

# copy application into image gopath.

WORKDIR /go/src/github.com/schonmann/challenge-bravo
COPY . .

# use git to get dep and remove it right after to save space.

RUN apk add --no-cache git mercurial \
    && go get github.com/golang/dep/cmd/dep \
    && apk del git mercurial

# ensure vendor folder in correct state and install.

RUN dep ensure && rm $GOPATH/bin/dep

# build and set run command.

RUN go install ./...
RUN go build -o main ./entry/${role}/

CMD ["./main"]