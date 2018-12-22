FROM golang:1.11-alpine

ARG role

ENV CFGPATH=config/config.docker.json

WORKDIR /go/src/github.com/schonmann/challenge-bravo
COPY . .

RUN go get ./...
RUN go install ./...

RUN go build -o main ./entry/${role}/
CMD ["./main"]