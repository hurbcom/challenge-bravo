# start from base
FROM ubuntu:18.04

ENV FLASK_APP "challengebravo/__init__.py"
ENV FLASK_ENV=development

ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8

LABEL maintainer="Lucas Ribeiro <rbr.lucas1@gmail.com>"

RUN mkdir /app
WORKDIR /app

# Install the dependencies specified in requirements file
RUN set -xe \
    && apt-get update -y \
    && apt-get install -y python3-pip
COPY requirements.txt /app/
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt

# Copy all directories and files from host to container
COPY . /app

# CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]
RUN chmod u+x ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]