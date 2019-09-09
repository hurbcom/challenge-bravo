FROM python:latest

ENV DB_NAME=bravo
ENV DB_USER=bravo
ENV DB_PASSWORD=3R@v0
ENV DB_HOST=postgres
ENV PATH_PROJECT=/home/application

RUN apt-get update && apt-get install -y \
    nginx

WORKDIR $PATH_PROJECT
COPY . .
COPY ./default.conf /etc/nginx/sites-available/default

RUN chmod +x ./entrypoint.sh

EXPOSE 8000

CMD ["./entrypoint.sh"]
