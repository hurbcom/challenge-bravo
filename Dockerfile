FROM tecktron/python-bjoern:latest

WORKDIR /app

COPY ./ /app

RUN pip install -r requirements.txt

WORKDIR /app

EXPOSE 80

EXPOSE 8080

ENV PYTHONPATH "${PYTHONPATH}: /app"

WORKDIR .
