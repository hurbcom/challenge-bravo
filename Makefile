prod:
	- ( \
	   docker-compose -f docker-compose.yml up -d --build\
    )

dev:    
	- ( \
	   docker-compose  -f docker-compose.dev.yml up -d  --build \
    )
  
test:
	- ( \
       docker build -t tests -f tests/Dockerfile . \
	   docker run -it --name tests \
       docker rm -f tests\
    )
  
remove:
	- ( \
        docker rm -f flask \
        docker rm -f flask-dev \
        docker rm -f redis \
        docker rm -f webserver \
    )