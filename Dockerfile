FROM python:3.9.1
ADD . /challenge_bravo
WORKDIR /challenge_bravo
RUN pip install -r requirements.txt