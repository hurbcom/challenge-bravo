FROM allanbatista/phoenix:0.6

EXPOSE 4000

ENV DEBIAN_FRONTEND=noninteractive
ENV MIX_ENV=prod

ADD . /opt/app
WORKDIR /opt/app

RUN mix deps.get

CMD mix compile && PORT=4000 mix phoenix.server