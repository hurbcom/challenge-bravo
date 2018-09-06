FROM golang:1.11

ARG wdir=/go/src/github.com/yagotome/challenge-bravo
WORKDIR ${wdir}
ADD . .

# Defining args
ARG env=dev
ARG appname

# Setting environment variables
ENV GO111MODULE=on
ENV GOCONFIGPATH ${wdir}/config/config.docker.${env}.json

# Build (go v1.11 installs all dependencies from go.mod, using vendor folder to caching)
RUN go build -mod=vendor -o $GOPATH/bin/app cmd/${appname}/main.go

CMD ["app"]