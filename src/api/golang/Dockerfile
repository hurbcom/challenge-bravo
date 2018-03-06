FROM golang
ADD . /go/src/converter
RUN go get github.com/gorilla/mux
RUN go get github.com/mediocregopher/radix.v2/redis
RUN go get github.com/mediocregopher/radix.v2/pool
RUN cd /go/src/converter && go build
CMD "/go/src/converter/converter"