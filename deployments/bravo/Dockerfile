FROM node:latest AS node
RUN mkdir /app
WORKDIR /app
COPY . .
WORKDIR /app/frontend
RUN npm install
RUN npm install -g @angular/cli
RUN ng build
RUN mv dist/frontend /app/static

FROM golang:latest
COPY --from=node /app /app
WORKDIR /app
RUN go mod download
RUN go build -o bravo-server ./cmd/backend/
RUN chmod +x bravo-server
ENV PATH="/app:${PATH}"
CMD bravo-server