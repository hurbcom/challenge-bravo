# setup
FROM python:latest
WORKDIR /app
# file copy 
COPY script/locustfile.py /app/locustfile.py
# deps install
RUN pip3 install locust
# execution
CMD locust
