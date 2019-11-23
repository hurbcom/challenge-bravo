FROM golang:alpine

ADD https://github.com/golang/dep/releases/download/v0.4.1/dep-linux-amd64 /usr/bin/dep
RUN chmod +x /usr/bin/dep
COPY . $GOPATH/src/github.com/hurbcom/challenge-bravo

ENV GIN_MODE=release
ENV EXTERNAL_API_KEY=a3ff0024-6b40-49c0-8d9b-7982e33e6f24

WORKDIR $GOPATH/src/github.com/hurbcom/challenge-bravo
COPY Gopkg.lock Gopkg.toml $GOPATH/src/github.com/hurbcom/challenge-bravo/
RUN apk add --no-cache bash git openssh  && dep ensure --vendor-only && apk del bash git openssh
RUN go install

EXPOSE 8080

CMD ["challenge-bravo"]