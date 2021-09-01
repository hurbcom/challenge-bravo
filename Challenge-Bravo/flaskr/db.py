# -*- coding: utf-8 -*-
"""
Created on Tue Aug 31 17:13:12 2021

@author: lucas
"""

##Código importado da documentação oficial do flask utilizando sqlite

import sqlite3

import click
from flask import current_app, g
from flask.cli import with_appcontext

DATABASE = 'database.db'

def init_db():
    db = get_db()
    with current_app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))

@click.command('init-db')
@with_appcontext
def init_db_command():
    init_db()
    click.echo('Database initialized')

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db


def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()
        
def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)

# @app.teardown_appcontext
# def close_connection(exception):
#   db = getattr(g, '_database', None)
#   if db is not None:
#       db.close()