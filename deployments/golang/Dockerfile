FROM golang:latest
RUN mkdir /app
WORKDIR /app
COPY . .
RUN go mod download
RUN go build -o bravo-server ./cmd/backend/
RUN chmod +x bravo-server
ENV PATH="/app:${PATH}"
CMD bravo-server