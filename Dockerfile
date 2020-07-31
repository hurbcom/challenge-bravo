FROM python:3
RUN mkdir /var/www
RUN mkdir /var/www/currency-api
WORKDIR /var/www/currency-api
COPY . /var/www/currency-api/
RUN pip install -r requirements.txt
