FROM python:3.7

LABEL MAINTAINER="Diego Silva de Salles disalles7@gmail.com"

ENV GROUP_ID=1000 \
    USER_ID=1000


WORKDIR /var/www/

ADD . /var/www/
ADD ./requirements.txt /var/www/requirements.txt

RUN  pip3 install --upgrade pip
RUN  pip3 install -r requirements.txt
RUN  pip3 install gunicorn

RUN groupadd -g $GROUP_ID www
RUN useradd -u $USER_ID -g $GROUP_ID  -G www www  -s /bin/bash 

USER www

EXPOSE 5000

CMD [ "gunicorn", "-w", "4", "--bind", "0.0.0.0:5000","--preload", "autoapp:application"]

