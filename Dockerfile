# Build stage

# https://hub.docker.com/_/golang
FROM golang:1.19-alpine3.17 AS builder

LABEL maintainer="charles schiavinato charles.schiavinato@yahoo.gom.br"

WORKDIR /app

COPY . .

RUN go mod download

RUN go build -o hurbcom-currency server.go

# Run stage
FROM alpine:3.17

WORKDIR /app

COPY --from=builder /app/hurbcom-currency .
COPY --from=builder /app/swagger.yaml .
COPY --from=builder /app/service/database/migration ./migration

EXPOSE 9000

CMD [ "./hurbcom-currency" ]