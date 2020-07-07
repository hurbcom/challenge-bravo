FROM golang:1.13.11-buster AS builder

COPY . /opt/app

WORKDIR /opt/app

RUN make

FROM alpine:3.11.6 AS artifact

COPY --from=builder /opt/app/dist/bin/doc /usr/bin/doc

CMD ["/usr/bin/doc"]
