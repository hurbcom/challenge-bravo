FROM python:3
ENV PYTHONUNBUFFERED=1
WORKDIR /bravo
COPY requirements.txt /bravo/
RUN pip install -r requirements.txt
COPY . /bravo/
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh