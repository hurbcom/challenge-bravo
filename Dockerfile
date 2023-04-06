FROM golang:1.19-alpine

WORKDIR /app

COPY go.mod ./
RUN go mod download

COPY ./src/*.go ./

RUN go build -o /chanllenge-bravo

EXPOSE 8080

CMD [ "/chanllenge-bravo" ]