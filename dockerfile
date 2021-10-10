FROM python:3.6.12-alpine

RUN mkdir api
WORKDIR /api

COPY ./src ./src/
COPY app.py ./
COPY config.py ./
COPY requirements.txt ./

RUN pip install -r requirements.txt; exit 0
RUN pip install Flask-Cors
RUN pip install Flask
RUN pip install Cerberus
RUN pip install pymongo

EXPOSE 5000

CMD ["flask","run","--host", "0.0.0.0"]



