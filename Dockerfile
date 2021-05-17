FROM python:3.7-alpine

RUN apk update
RUN pip install --no-cache-dir pipenv

WORKDIR /usr/app/hurby
COPY configmap-prd.env main.py Pipfile Pipfile.lock main.sh ./
COPY src ./src
COPY data ./data

RUN pipenv install

EXPOSE 5000
ENTRYPOINT ["/usr/app/hurby/main.sh"]