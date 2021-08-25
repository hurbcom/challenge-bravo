FROM python:latest
WORKDIR /app
COPY locustfile.py /app/locustfile.py
RUN pip3 install locust
CMD locust
