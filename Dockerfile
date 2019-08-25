FROM golang
ENV GO111MODULE=on
ENV CHALLENGE_BRAVO_WORKDIR /go/src/github.com/tmcb/challenge-bravo
ADD . ${CHALLENGE_BRAVO_WORKDIR}
WORKDIR ${CHALLENGE_BRAVO_WORKDIR}
RUN go install -i ./...
ENTRYPOINT /go/bin/challenge-bravo
EXPOSE 8080
