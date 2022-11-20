FROM golang:1.19.3

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . . 
RUN go build -o challenge-bravo ./cmd/main.go

EXPOSE 5000

CMD [ "./challenge-bravo" ]