FROM python:3.7-slim

RUN apt-get update -y
RUN pip install --upgrade pip setuptools wheel
RUN pip install --no-cache-dir pipenv

WORKDIR /usr/app/hurby
COPY configmap-prd.env main.py Pipfile Pipfile.lock main.sh ./
COPY src ./src
COPY data ./data

RUN pipenv install

EXPOSE 5000
ENTRYPOINT ["sh", "/usr/app/hurby/main.sh"]