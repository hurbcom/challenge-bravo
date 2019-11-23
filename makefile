## go

_docker:
	@sudo docker build -t brave-go .
	@sudo docker run -d -p 8080:8080 brave-go

docker: _docker