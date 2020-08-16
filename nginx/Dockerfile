FROM nginx:1.19.2-alpine

LABEL MAINTAINER="Nome Sobrenome <example@domain.com>"

RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log && \
    mkdir /etc/nginx/sites-enabled/ && \
    mkdir -p /run/nginx && \
    mkdir -p /data/nginx/cache && \
    rm -rf /etc/nginx/conf.d/default.conf && \
    rm -rf /var/cache/apk/*


COPY conf.d/app.conf /etc/nginx/conf.d/app.conf
COPY conf.d/http.conf  /etc/nginx/conf.d/http.conf
COPY conf.d/nginx.conf  /etc/nginx/nginx.conf


EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]