FROM golang
ADD . /go/src/converter
RUN curl https://raw.githubusercontent.com/golang/dep/master/install.sh | sh
RUN cd /go/src/converter && dep ensure &&go build
CMD "/go/src/converter/converter"