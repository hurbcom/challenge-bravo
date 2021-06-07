FROM python:3.8

ADD . /testHurb
WORKDIR /testHurb

ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN chmod -R 644 app.py
RUN pip install -r requirements.txt

EXPOSE 5000

CMD [ "python", "app.py" ]
