FROM golang:1.19.3-alpine

WORKDIR /app

COPY . .

RUN go mod download

RUN go install github.com/cosmtrek/air@latest

EXPOSE 8080

CMD ["air", "-c", "./build/.air.toml"]