FROM golang:1.15-alpine as builder
RUN apk update && apk add ca-certificates
WORKDIR /service
COPY ./ /service/
RUN go mod tidy
RUN go build -o ./ ./
FROM alpine:latest
WORKDIR /service
COPY --from=builder /service/api /service/config.json ./
ENTRYPOINT ["/seyrvice/api", "run"]