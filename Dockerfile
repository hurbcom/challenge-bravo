FROM python:3.9.2-slim

WORKDIR /var/www

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY Pipfile .
COPY Pipfile.lock .

RUN pip install --upgrade pipenv
RUN pipenv install --system --deploy

COPY . .

RUN apt-get update || : && apt-get install -y \
    python \
    build-essential \
    gettext \
    libgettextpo-dev \
    &&  apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ENTRYPOINT [ "./.docker/entrypoint.sh" ]