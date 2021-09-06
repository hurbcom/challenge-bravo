# -*- coding: utf-8 -*-
"""
Created on Tue Aug 31 22:13:15 2021

@author: lucas
"""

from . import db
        
class Currency:
    def __init__(self, symbol = None, usd_value = None, keep_updated = None):
        self.symbol = symbol.upper()
        self.usd_value = usd_value
        self.keep_updated = keep_updated

def create(currency):
    con = db.get_db()
    cur = con.cursor()
    if (retrieveValue(currency) is not None):
        return
    cur.execute("INSERT INTO currency (symbol, usd_value, keep_updated) VALUES (?, ?, ?)", (currency.symbol.upper(), currency.usd_value, currency.keep_updated,))
    con.commit()
    
def retrieveValue(currency):
    con = db.get_db()
    cur = con.cursor()
    cur.execute("SELECT usd_value FROM currency WHERE symbol = ?", (currency.symbol,))
    row = cur.fetchone()
    if row is not None:
        return float(row[0])
    else:
        return
    
def update(currency):
    con = db.get_db()
    cur = con.cursor()
    cur.execute("UPDATE currency SET usd_value = ? WHERE symbol = ?", (currency.usd_value, currency.symbol,))
    con.commit()
    
def delete(currency):
    con = db.get_db()
    cur = con.cursor()
    cur.execute("DELETE FROM currency WHERE symbol = ?", (currency.symbol,))
    con.commit()
        
def retrieveCurrencies():
    con = db.get_db()
    cur = con.cursor()
    cur.execute("SELECT symbol FROM currency WHERE keep_updated = true")
    currencies = [item[0].upper() for item in cur.fetchall()]
    return currencies

def retrieveCurrency(symbol):
    con = db.get_db()
    cur = con.cursor()
    cur.execute("SELECT symbol, usd_value FROM currency WHERE symbol = ?", (symbol,))
    row = cur.fetchone()
    if row is not None:
        retrievedCurrency = Currency(row[0], row[1])
        return retrievedCurrency
    else:
        return