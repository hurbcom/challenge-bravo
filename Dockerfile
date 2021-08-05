FROM tecktron/python-bjoern:latest

# SOME TIMES .ENV FILE DOSENT WORK IN DOCKER CONTAINER, SO WE NEED TO DECLARE ENVIRIOMENTS VARIABLES HERE TOO - Rafael Sampaio
ENV DB_NAME=db.sqlite3
ENV SECRET_KEY=thisIsASuperSecretKeyForHurbChallengeDevEnvOnlyPleaseDoNotUseThisKeyInProductionEnvs
ENV BIT_PAY_SERVICE=https://bitpay.com/api/rates

WORKDIR /app

COPY ./ /app

RUN pip install -r requirements.txt

WORKDIR /app

EXPOSE 80

EXPOSE 8080

ENV PYTHONPATH "${PYTHONPATH}: /app"

WORKDIR .
