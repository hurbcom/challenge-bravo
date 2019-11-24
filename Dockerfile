FROM python:3.7

COPY . /src
WORKDIR /src/app

ENV CACHE_TIMOUT_INT_SECONDS=30
ENV EXCHANGE_RATES_URL=https://api.exchangeratesapi.io/
ENV COIN_CAP_URL=http://api.coincap.io/v2/

RUN pip3 install -r requirements.txt
# RUN pytest

ENTRYPOINT ["python"]
CMD ["app.py"]
