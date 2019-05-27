FROM python:3.7
RUN mkdir /currencies
WORKDIR /currencies
ADD requirements.txt /currencies/
RUN pip install -r requirements.txt
ADD . /currencies/
RUN python manage.py migrate
RUN cp sample.env .env
CMD python manage.py runserver --noreload