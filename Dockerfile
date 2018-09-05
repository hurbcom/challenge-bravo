FROM golang:1.11

ARG wdir=/go/src/github.com/yagotome/challenge-bravo
WORKDIR ${wdir}
ADD . .

# Defining args
ARG env=dev

# Setting environment variables
ENV GO111MODULE=on
ENV GOCONFIGPATH ${wdir}/config/config.${env}.json

# Build (go v1.11 installs all dependencies in go.mod file)
RUN go build -mod=vendor -o $GOPATH/bin/server cmd/server/main.go

CMD ["server"]