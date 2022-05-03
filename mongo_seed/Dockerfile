FROM mongo:5.0

ARG MONGODB_URL

ENV MONGODB_URL ${MONGODB_URL}

COPY currencies.json /currencies.json

CMD mongoimport --uri ${MONGODB_URL} --collection currencies --drop --file /currencies.json --jsonArray
