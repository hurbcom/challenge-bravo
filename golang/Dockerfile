FROM golang:1.17-alpine

WORKDIR /go/src/app

COPY api/go.mod /go/src/app
COPY api/go.sum /go/src/app

RUN go mod download

COPY api/ /go/src/app

ENV CGO_ENABLED 0

RUN go build -o /exchange-rate-api

EXPOSE 9092

CMD [ "/exchange-rate-api" ]