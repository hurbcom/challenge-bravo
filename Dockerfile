FROM ubuntu:18.04

ENV FLASK_APP "app.py"
ENV FLASK_ENV=development

ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8

LABEL maintainer="Wilson Ricardo Pereira Silveira <ricardopereirasilveira@gmail.com>"

RUN mkdir /app
WORKDIR /app

RUN set -xe \
    && apt-get update -y \
    && apt-get install -y python3-pip
COPY requirements.txt /app/
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt

# Copy all directories and files from host to container
COPY . /app
RUN chmod u+x ./settings.sh
ENTRYPOINT ["./settings.sh"]