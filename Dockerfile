FROM golang

#ENV GO111MODULE=on

ADD . .
WORKDIR currency-api-go/

#RUN go mod download

#COPY . .
RUN ls
# Build the Go app
RUN go build -o main .

# Expose port 8080 to the outside world
EXPOSE 3000

# Command to run the executable
RUN pwd
CMD ["./main"]
#ENTRYPOINT "main"