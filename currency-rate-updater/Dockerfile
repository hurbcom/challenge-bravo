FROM golang:1.15-alpine as builder
RUN apk update && apk add ca-certificates
WORKDIR /service
COPY ./ /service/
RUN go mod tidy
RUN go build -o ./ ./
FROM alpine:latest
WORKDIR /service
COPY --from=builder /service/currency-rate-updater /service/config.json ./
ENTRYPOINT ["/service/currency-rate-updater", "run"]