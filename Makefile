prod:
	- ( \
	   docker-compose -f docker-compose.yml up -d --build\
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
        docker-compose down --rmi all  -v  --remove-orphans \
        )


clean-all-images:
	- ( \
         docker rmi -f $(docker images -q) \
        )