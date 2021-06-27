FROM ubuntu

MAINTAINER David Turati <davidturati@gmail.com>

RUN apt-get update
RUN apt upgrade -y
RUN apt install software-properties-common -y
RUN add-apt-repository ppa:deadsnakes/ppa -y
RUN apt-get install python3.9 -y
RUN apt-get install python3-pip -y
RUN apt-get install net-tools -y
RUN apt-get install iputils-ping -y
RUN apt install nginx -y
RUN apt install htop -y
WORKDIR /var/www/html
COPY requirements.txt /var/www/html
ENTRYPOINT ["bash", "entry.sh"]
EXPOSE 8000