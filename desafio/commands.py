# -*- coding: utf-8 -*-
import os

import click
from flask.cli import with_appcontext
from desafio.extensions import db
from desafio.currency.model import Currency


HERE = os.path.abspath(os.path.dirname(__file__))
PROJECT_ROOT = os.path.join(HERE, os.pardir)
TEST_PATH = os.path.join(PROJECT_ROOT, 'tests')


def init_db():
    db.drop_all()
    db.create_all()


@click.command("init-db")
@with_appcontext
def init_db_command():
    """Clear existing data and create new tables."""
    init_db()
    click.echo("Initialized the database.")


@click.command()
def test():
    """Run the tests."""
    import pytest
    rv = pytest.main([TEST_PATH, '--verbose'])
    exit(rv)


@click.command()
@with_appcontext
def seed():
    db.session.add(Currency(simbol_currency="BRL",
                            name_description="Real"
                            ))
    db.session.add(Currency(simbol_currency="USD",
                            name_description="Dolar"
                            ))
    db.session.add(Currency(simbol_currency="EUR",
                            name_description="EURO"
                            ))
    db.session.add(Currency(simbol_currency="BTC",
                            name_description="Bitcoin"
                            ))
    db.session.add(Currency(simbol_currency="ETH",
                            name_description="Ethereum"
                            ))
    db.session.commit()
