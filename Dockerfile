# Build stage
FROM golang:1.23.3-alpine AS builder

WORKDIR /app

# Copy only essential files for dependency management
COPY go.mod go.sum ./

RUN go mod download

# Copy the rest of the source code
COPY . .

# Format and check the code
RUN go fmt ./...
RUN go vet ./...

# Build the application with CGO disabled and optimized for size
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o challenge-bravo

# Production stage
FROM alpine:3.12

WORKDIR /app

# Install the tzdata package and set the timezone
RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime \
    && rm -rf /var/cache/apk/*

# Copy the binary from the build stage
COPY --from=builder /app/challenge-bravo .

# Copy the .env file ##DEV ONLY
COPY .env .env

# Copy the script to the container
COPY docker/cronjob/run_sync.sh /usr/local/bin/run_sync.sh

# Add the cronjob
RUN echo "0 0 * * * /usr/local/bin/run_sync.sh" >> /etc/crontabs/root

# Set the command to run the application
CMD ["./challenge-bravo"]

# Expose port 8080
EXPOSE 8080