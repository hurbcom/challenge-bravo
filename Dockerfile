from golang:alpine

WORKDIR /app
COPY . .

# The go mod download command downloads the named modules into the module cache
# Refer: https://golang.org/ref/mod#go-mod-download
RUN go mod download


# Build the aplication go lang
# The function of comand `go build` is compile packages and dependencies
# Refer: https://pkg.go.dev/cmd/go
RUN go build main.go

EXPOSE 8080

CMD ["./main"]