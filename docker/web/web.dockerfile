FROM nginx:1.13

COPY /docker/web/vhost.conf /etc/nginx/conf.d/default.conf