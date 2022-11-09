FROM golang:1.19

WORKDIR /go/src/app
COPY . .

RUN go get -d -v
RUN go build -v -o ./app 

# RUN go test ./...

ENTRYPOINT ["./start.sh"]