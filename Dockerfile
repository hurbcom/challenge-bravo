from python:3.9.6-buster

LABEL Author='Rodrigo Cantarino <rodrigopcantarino@gmail.com>'

ENV TZ=America/Sao_Paulo
ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8
ENV BASEDIR_DOCKER='/challenge-bravo'

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN DEBIAN_FRONTEND=noninteractive apt-get update && apt upgrade -yq

RUN DEBIAN_FRONTEND=noninteractive apt-get install -y tzdata apt-utils
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y sudo
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y debconf-utils
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y build-essential vim curl tree \
    postgresql-client sqlite3

RUN echo 'PATH=$PATH:~/' > ~/.profile
RUN echo 'PATH=$PATH:~/' > ~/.bash_profile

RUN pip3 install --upgrade pip

RUN pip3 install virtualenv

RUN mkdir ${BASEDIR_DOCKER}

COPY ./api ${BASEDIR_DOCKER}/api
COPY ./logs ${BASEDIR_DOCKER}/logs

ADD requirements.txt ${BASEDIR_DOCKER}/requirements.txt
ADD docker-entrypoint.sh ${BASEDIR_DOCKER}/docker-entrypoint.sh

WORKDIR ${BASEDIR_DOCKER}/

RUN echo "\33[31m...Criando virtualenv...\33[39m"
RUN virtualenv ${BASEDIR_DOCKER}/venv/

RUN chmod -R 755 venv/

RUN echo "\33[31m...Carregando virtualenv...\33[39m"
RUN source venv/bin/activate

RUN pip3 install -r requirements.txt

EXPOSE 8008

ENTRYPOINT ["sh", "docker-entrypoint.sh"]

# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
