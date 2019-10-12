from flask import g
import sqlite3
from app import app
    
database_path = 'currency.db'

def get():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(database_path)
    db.row_factory = make_dicts
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def query(query, one=False):
    cur = get().execute(query)
    rv = cur.fetchone() if one else cur.fetchall()
    cur.close()
    return rv

def transaction(query):
    db = get()
    cur = db.execute(query)
    db.commit()
    cur.close()

def init():
    with app.app_context():
        db = get()
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

def make_dicts(cursor, row):
    return dict((cursor.description[idx][0], value) for idx, value in enumerate(row))