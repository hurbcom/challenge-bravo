FROM golang:1.16

COPY go.mod go.sum /go/src/github.com/MA-Andrade/challenge-bravo/
WORKDIR /go/src/github.com/MA-Andrade/challenge-bravo
RUN go mod download
COPY . /go/src/github.com/MA-Andrade/challenge-bravo
RUN go build -o main .
EXPOSE 5000
CMD ["./main"]