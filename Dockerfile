FROM python:3.8-slim

WORKDIR /app

COPY src/requirements.txt src/requirements.txt

RUN pip install --upgrade pip
RUN pip install -r /app/src/requirements.txt

COPY src src
COPY .env .env

CMD gunicorn --bind :8080 --chdir src --workers 1 --threads 8 --log-level=info --timeout 0 src.main:app
