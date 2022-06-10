FROM golang:1.18-alpine
COPY . /app
WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

RUN go build cmd/main.go

EXPOSE 8080
CMD ["/app/main"]