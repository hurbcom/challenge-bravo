import sys
import os
sys.path.append( os.path.dirname( os.path.dirname( os.path.abspath(__file__) ) ) )

import pytest
import json
import tempfile

from app import app
from db.operations import DatabaseOperations
from models.currency import Currency

@pytest.fixture
def client():
    db_fd, app.config['DATABASE'] = tempfile.mkstemp()
    DatabaseOperations.populate_db()
    
    app.config['TESTING'] = True

    with app.test_client() as client:
        with app.app_context():
            DatabaseOperations.populate_db()
        yield client
    
    os.close(db_fd)
    os.unlink(app.config['DATABASE'])


def test_create(client):
    
    res = client.post('/currencies/', 
        data = json.dumps({'symbol':'ATOM'}),
        content_type = 'application/json')

    result_json = res.get_json()

    assert res.status_code == 201

    assert 'Inserted Id' in result_json['message']

    

def test_verify_inserted(client):
    
    res = client.get('/currencies/ATOM/')

    result_json = res.get_json()

    assert res.status_code == 200

    assert '_id' in result_json
    assert 'symbol' in result_json
    assert 'value' in result_json
    assert 'created_at' in result_json
    assert 'updated_at' in result_json

    assert result_json['symbol'] == 'ATOM'



def test_delete(client):
    
    res = client.delete('/currencies/ATOM')

    result_json = res.get_json()

    assert res.status_code == 200

    assert 'removed successfully' in result_json['message']