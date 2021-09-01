# -*- coding: utf-8 -*-
"""
Created on Tue Aug 31 22:13:15 2021

@author: lucas
"""

from . import db
        
class Currency:
    def __init__(self, symbol = None, usd_value = None):
        self.symbol = symbol
        self.usd_value = usd_value

def create(currency):
    con = db.get_db()
    cur = con.cursor()
    if (db.retrieve(currency) != None):
        return
    cur.execute("INSERT INTO currency (symbol, usd_value) VALUES (?, ?)", (currency.symbol, currency.usd_value,))
    con.commit()
    
def retrieveValue(currency):
    con = db.get_db()
    cur = con.cursor()
    row = cur.execute("SELECT usd_value FROM currency WHERE symbol = ?", (currency.symbol,))
    return float(cur.fetchone()[0])
    
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
         