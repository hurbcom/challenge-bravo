# setup
FROM python:latest
WORKDIR /app
# project files copy
COPY src /app/src
COPY requirements.txt /app/requirements.txt
# project file alterations and deps installation
RUN pip3 install -r requirements.txt
# execution
EXPOSE 8033
CMD sanic src.api.app --port=8033