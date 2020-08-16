prod:
	- ( \
	  docker-compose  -f docker-compose.yml up -d --no-deps --build webserver redis mysql flask\
    )

teste-carga:
	- ( \
	  docker-compose  -f docker-compose.yml up -d --build \
    )


dev:    
	- ( \
	   docker-compose  -f docker-compose.dev.yml up -d  --build\
    )
  
test:
	- ( \
       docker build -t tests -f tests/Dockerfile . ; \
	   docker run -it tests;  \
       docker rmi -f tests;\
    )
  
remove:
	- ( \
        docker-compose stop;\
        docker-compose down --rmi all  -v  --remove-orphans ; \
        docker volume prune; \
        )