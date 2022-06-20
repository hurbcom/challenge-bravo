FROM mongo:latest

COPY init.json /init.json

CMD mongoimport --host mongodb --db default_db --collection currency --file /init.json --jsonArray --authenticationDatabase admin --username admin --password admin
