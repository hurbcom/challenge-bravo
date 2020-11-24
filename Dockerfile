FROM ubuntu:bionic
RUN apt-get update && apt-get install -y \
  ca-certificates
WORKDIR /app
COPY ./bin/challenge-bravo /app/
ENTRYPOINT ["/app/challenge-bravo"]