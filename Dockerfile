FROM golang:1.19-alpine

WORKDIR /app

COPY go.mod ./
RUN go mod download

COPY .. .

RUN rm -rf docs

RUN go install github.com/swaggo/swag/cmd/swag@latest

RUN swag init

RUN go build -o /chanllenge-bravo

EXPOSE 8080

CMD [ "/chanllenge-bravo" ]