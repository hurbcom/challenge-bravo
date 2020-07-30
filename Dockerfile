FROM python:3
RUN mkdir /var/www
RUN mkdir /var/www/exchange-api
WORKDIR /var/www/exchange-api
COPY . /var/www/exchange-api/
RUN pip install -r requirements.txt