FROM golang:alpine as builder

WORKDIR /api

RUN apk update && apk add --no-cache git curl

COPY go.mod go.sum /
RUN go mod download 

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/api

FROM alpine:latest
RUN apk --no-cache add ca-certificates

WORKDIR /root/

COPY --from=builder /api/main .
COPY --from=builder /api/env/application.env .       

EXPOSE 8080

CMD ["./main"]