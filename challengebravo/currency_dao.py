# -*- coding: utf-8 -*-
"""
Created on Tue Aug 31 22:13:15 2021

@author: lucas
"""

from . import db
        
class Currency:
    def __init__(self, symbol = None, equivalent_to_usd = None, keep_updated = None):
        self.symbol = symbol
        self.equivalent_to_usd = equivalent_to_usd
        self.keep_updated = keep_updated

def create(currency):
    con = db.get_db()
    cur = con.cursor()
    if (retrieveValue(currency) is not None):
        return
    cur.execute("INSERT INTO currency (symbol, equivalent_to_usd, keep_updated) VALUES (?, ?, ?)", (currency.symbol, currency.equivalent_to_usd, currency.keep_updated,))
    con.commit()
    
def retrieveValue(currency):
    con = db.get_db()
    cur = con.cursor()
    cur.execute("SELECT equivalent_to_usd FROM currency WHERE symbol = ?", (currency.symbol,))
    row = cur.fetchone()
    if row is not None:
        return float(row[0])
    else:
        return
    
def update(currency):
    con = db.get_db()
    cur = con.cursor()
    cur.execute("UPDATE currency SET equivalent_to_usd = ? WHERE symbol = ?", (currency.equivalent_to_usd, currency.symbol,))
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
    currencies = [item[0] for item in cur.fetchall()]
    return currencies