FROM python:3.7

LABEL MAINTAINER="Diego Silva de Salles disalles7@gmail.com"

WORKDIR /tests/

ADD . /tests
ADD ./requirements.txt /tests/requirements.txt

RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt;

CMD [ "flask","test"]

