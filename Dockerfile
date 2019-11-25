FROM python:3.7

COPY . /src
WORKDIR /src/app

RUN pip3 install -r requirements.txt
RUN python -m pytest tests/unit/

ENV CACHE_TIMEOUT_INT_SECONDS=30
ENV EXCHANGE_RATES_URL=https://api.exchangeratesapi.io/
ENV COIN_CAP_URL=http://api.coincap.io/v2/

RUN python -m pytest tests/integration/

ENTRYPOINT ["python"]
CMD ["app.py"]
