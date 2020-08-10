install:
	- virtualenv -p python3 ../challenge-bravo/build
	- ( \
        .  build/bin/activate; \
        pip3 install -r requirements.txt; \
    )

run:
	- ( \
       .  build/bin/activate; \
       FLASK_ENV=development \
       FLASK_DEBUG=true \
	   FLASK_APP=autoapp   flask run\
    )

migrate:
	- ( \
       .  build/bin/activate; \
	   FLASK_APP=autoapp  FLASK_ENV=development FLASK_DEBUG=true  flask db init;\
       FLASK_APP=autoapp  FLASK_ENV=development FLASK_DEBUG=true  flask db migrate;\
       FLASK_APP=autoapp  FLASK_ENV=development FLASK_DEBUG=true flask db upgrade;\
    )

test:
	- ( \
       .  build/bin/activate; \
	   FLASK_APP=autoapp flask test;\
    )
