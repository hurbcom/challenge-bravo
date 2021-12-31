FROM node:latest AS node
RUN mkdir /node_app
WORKDIR /node_app
COPY . .
WORKDIR /node_app/frontend
RUN npm install
RUN npm install -g @angular/cli
RUN ng build
WORKDIR /node_app
RUN mv frontend/dist/frontend static

FROM golang:latest
COPY --from=node /node_app /app
WORKDIR /app
RUN go install github.com/swaggo/swag/cmd/swag@latest
RUN swag init -o swagger -g server.go -d ./server/,./model/,./dao/
RUN go mod download
RUN go build -o bravo-server ./cmd/backend/
RUN chmod +x bravo-server
ENV PATH="/app:${PATH}"
CMD bravo-server