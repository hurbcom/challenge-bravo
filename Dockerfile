FROM python:3.9

ENV PYTHONPATH /code
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

COPY ./.env /code/.env

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./alembic.ini /code

COPY ./alembic /code/alembic

COPY ./app /code/app

COPY ./entrypoint.sh /code

RUN ["chmod", "+x", "/code/entrypoint.sh"]

# run entrypoint.sh
ENTRYPOINT ["sh", "/code/entrypoint.sh"]

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]