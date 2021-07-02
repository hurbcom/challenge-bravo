FROM ubuntu

MAINTAINER David Turati <davidturati@gmail.com>

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update -y
RUN apt install software-properties-common -y
RUN add-apt-repository ppa:deadsnakes/ppa -y
RUN apt-get install python3.8 -y
RUN apt-get install python3-pip -y
RUN apt-get install net-tools -y
RUN apt-get install iputils-ping -y
RUN apt-get install nginx -y
RUN apt-get install htop -y
RUN apt-get install gunicorn -y
RUN apt-get install supervisor -y
WORKDIR /app
COPY requirements.txt /app
ENTRYPOINT ["bash", "entry.sh"]
EXPOSE 8000

COPY . .