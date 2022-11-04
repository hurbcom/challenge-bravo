FROM golang:1.16-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash build-base

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . .

RUN go build -o /main

EXPOSE 8080

CMD [ "/main" ]