FROM golang:1.10 AS builder

RUN apt-get update && apt-get install git && apt-get install ca-certificates apache2-utils apt-transport-https -y && wget -O /usr/bin/dep https://github.com/golang/dep/releases/download/v0.5.0/dep-linux-amd64 && chmod +x /usr/bin/dep

WORKDIR /go/src/challenge-bravo

ADD api/handlers/*.go /go/src/challenge-bravo/api/handlers/
ADD api/server/*.go /go/src/challenge-bravo/api/server/
ADD cache/*.go /go/src/challenge-bravo/cache/
ADD config/*.go /go/src/challenge-bravo/config/
ADD converter/*.go /go/src/challenge-bravo/converter/
ADD logger/*.go /go/src/challenge-bravo/logger/
ADD rates/*.go /go/src/challenge-bravo/rates/
ADD util/*.go /go/src/challenge-bravo/util/
ADD worker/*.go /go/src/challenge-bravo/worker/
ADD *.go /go/src/challenge-bravo/
ADD Gopkg.* /go/src/challenge-bravo/

RUN dep ensure -vendor-only -v

RUN CGO_ENABLED=0 GOARCH=amd64 go build -a -tags netgo -ldflags '-w -s' -o curapi curapi.go
RUN chmod +x curapi

FROM scratch

COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /go/src/challenge-bravo/curapi /curapi

ENV PORT 8080
ENV GOMAXPROCS 16

EXPOSE 8080
CMD ["/curapi"]
