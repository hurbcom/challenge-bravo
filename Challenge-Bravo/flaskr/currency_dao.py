# -*- coding: utf-8 -*-
"""
Created on Tue Aug 31 22:13:15 2021

@author: lucas
"""

from . import db
        
class Currency:
    def __init__(self, symbol = None, value_usd = None):
        self.symbol = symbol
        self.value_usd = value_usd

def create(currency):
    con = db.get_db()
    cur = con.cursor()
    if (db.retrieve(currency) != None):
        return
    cur.execute("INSERT INTO currency (symbol, value_usd) VALUES (?, ?)", (currency.symbol, currency.value_usd,))
    con.commit()
    
def retrieveValue(currency):
    con = db.get_db()
    cur = con.cursor()
    cur.execute("SELECT value_usd FROM currency WHERE symbol = ?", (currency.symbol,))
    return float(cur.fetchone()[0])
    
def update(currency):
    con = db.get_db()
    cur = con.cursor()
    cur.execute("UPDATE currency SET value_usd = ? WHERE symbol = ?", (currency.value_usd, currency.symbol,))
    con.commit()
        
    
def delete(currency):
    con = db.get_db()
    cur = con.cursor()
    cur.execute("DELETE FROM currency WHERE symbol = ?", (currency.symbol,))
    con.commit()
         

def retrieveCurrencies():
    con = db.get_db()
    cur = con.cursor()
    cur.execute("SELECT symbol FROM currency")
    currencies = [item[0] for item in cur.fetchall()]
    return currencies