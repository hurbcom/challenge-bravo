FROM golang
RUN mkdir -p "$GOPATH/src/github.com/maypimentel/challenge-bravo/src/api/golang"
WORKDIR "/go/src/github.com/maypimentel/challenge-bravo/src/api/golang"
ADD . /go/src/github.com/maypimentel/challenge-bravo/src/api/golang
RUN curl https://raw.githubusercontent.com/golang/dep/master/install.sh | sh
RUN dep ensure &&go build
CMD "./converter"