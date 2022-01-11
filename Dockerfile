FROM python:3.6.12

COPY /src /src
COPY requirements.txt /src

RUN pip3 install -r ./src/requirements.txt

WORKDIR /src

EXPOSE 5000
ENTRYPOINT ["python3"]
CMD ["app.py"]