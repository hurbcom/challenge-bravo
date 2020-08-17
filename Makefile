prod:
	- ( \
	  docker-compose  -f docker-compose.yml up -d  --build flask  mysql  redis webserver   \
    )

testcarga:
	- ( \
	  docker-compose  -f docker-compose.yml up  --build \
    )
    
dev:    
	- ( \
	   docker-compose  -f docker-compose.dev.yml up -d  --build\
    )
  
testdocker:
	- ( \
       docker build -t tests -f tests/Dockerfile . ; \
	     docker run -it tests;  \
    )

removetest:
	- ( \
       docker rmi -f tests;\
    )
  
remove:
	- ( \
        docker-compose stop;\
        docker-compose down --rmi all  -v  --remove-orphans ; \
        docker volume prune; \
        docker image prune; \
        )

test:
	- ( \
       .  build/bin/activate; \
	   FLASK_APP=autoapp flask test;\
    )

migrate:
	- ( \
       .  build/bin/activate; \
	FLASK_APP=autoapp FLASK_DEBUG=true  flask db init;\
       FLASK_APP=autoapp  FLASK_DEBUG=true flask db migrate;\
       FLASK_APP=autoapp  FLASK_DEBUG=true flask db upgrade;\
    )

install:
	- virtualenv -p python3 ../challenge-bravo/build
	- ( \
        .  build/bin/activate; \
        pip3 install -r requirements.txt; \
    )

run:
	- ( \
       .  build/bin/activate; \
	   FLASK_APP=autoapp   FLASK_DEBUG=true flask run\
    )