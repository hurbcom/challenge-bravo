#-- Methods to test all endpoints of api --#

import pytest
import requests

#define root url
url = 'http://0.0.0.0:5000'

#-- test success --#

#test endpoint to get all users
def test_get_all_users():
    r = requests.get(url+'/api/conversion')
    assert r.status_code == 200

#test endpoint to save currency code 
def test_add_currency():
    r = requests.post(url+'/api/conversion/UTC')
    assert r.status_code == 201

#test endpoint for currency conversion
def test_currency_conversion():
    r = requests.post(url+'/api/conversion/USD/EUR/120')
    assert r.status_code == 200

#test endpoint to delete currency code
def test_delete_currency():
    r = requests.delete(url+'/api/conversion/6')
    assert r.status_code == 200

#-- test failure --#

#test failure add currency code (already in database)
def test_failure_add():
    r = requests.post(url+'/api/conversion/USD')
    assert r.status_code == 409

#test failure delete currency code (Code not found)
def test_failure_delete():
    r = requests.delete(url+'/api/conversion/999')
    assert r.status_code == 404

#test failure currency conversion (Code not found in database)
def test_failure_db_conversion():
    r = requests.post(url+'/api/conversion/USD/ARS/120')
    assert r.status_code == 405

#test failure currency conversion (Code not not suported)
# def test_failure_not_supported():
#     r = requests.post(url+'/api/conversion/USD/UTC/120')
#     assert r.status_code == 500