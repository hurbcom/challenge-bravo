from typing import Generator

import pytest
from fastapi.testclient import TestClient

from app.core.config import settings
from app.dependencies import get_db
from app.main import app

from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

from app.db import session, init_db

from app.db.base_class import Base

engine = None


@pytest.fixture(autouse=True, scope='session')
def database_session_fixture():
    global engine

    conn = session.engine.connect()
    conn.execute('commit')
    conn.execute('create database app_automated_tests')

    sqlalchemy_database_uri = (
        f"postgresql://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_SERVER}/app_automated_tests"
    )

    engine = create_engine(sqlalchemy_database_uri, pool_pre_ping=True)
    session.db_session = scoped_session(
        sessionmaker(autocommit=False, autoflush=False, bind=engine)
    )
    session.Session = session.db_session

    yield

    engine.dispose()
    conn.execute('commit')
    conn.execute("drop database if exists app_automated_tests")


@pytest.fixture(scope="function")
def db():
    try:
        Base.metadata.create_all(engine)
        sess = session.Session()

        init_db.init_db(sess, settings.API_EXCHANGE_URL, settings.API_EXCHANGE_KEY)

        yield sess
    finally:
        sess.close()
        Base.metadata.drop_all(bind=engine)


def override_get_db():
    try:
        Base.metadata.create_all(engine)
        db = session.Session()
        init_db.init_db(db, settings.API_EXCHANGE_URL, settings.API_EXCHANGE_KEY)
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture(scope="module")
def client() -> Generator:
    with TestClient(app) as c:
        yield c
