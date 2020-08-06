install:
	- virtualenv -p python3 ../desafio/build
	- ( \
       .  build/bin/activate; \
        pip3 install -r requirements.txt; \
    )

run:
	- ( \
       .  build/bin/activate; \
	   FLASK_APP=desafio  flask run\
    )

migrate:
	- ( \
       .  build/bin/activate; \
	   FLASK_APP=desafio  flask db init;\
       FLASK_APP=desafio flask db migrate;\
       FLASK_APP=desafio  flask db upgrade;\
    )

test:
	- ( \
       .  build/bin/activate; \
	   pip install -e '.[test]';\
       pytest -v  \
    )
