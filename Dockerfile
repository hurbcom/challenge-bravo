# pull official base image
FROM python:3.8-alpine

# set work directory
WORKDIR /app

RUN apk update && \
    apk add postgresql-dev gcc python3-dev musl-dev

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip install -r requirements.txt

# copy project
COPY . .

RUN chmod +x entrypoint.sh
ENTRYPOINT ["sh", "entrypoint.sh"]
