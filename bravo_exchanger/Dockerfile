FROM python:3.8.10-slim-buster

ENV CACHE_BACKEND="django.core.cache.backends.dummy.DummyCache" \
    CACHE_LOCATION="" \
    SECRET_KEY="secret" \
    DEBUG=0

WORKDIR /usr/src/app

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN ["python", "manage.py", "migrate"]

EXPOSE 8001

CMD [ "python", "manage.py", "runserver", "0.0.0.0:8001" ]
