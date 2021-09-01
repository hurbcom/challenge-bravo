# -*- coding: utf-8 -*-
"""
Created on Tue Aug 31 22:13:15 2021

@author: lucas
"""

import DB

class CurrencyDAO:    
   
    def test(self):
        con = DB.get_db()
        cur = con.cursor()
        for row in cur.execute("SELECT * FROM currency"):
            print(row)
        cur.execute("DROP TABLE currency");
        con.commit()
        con.close()
        
    def create(currency):
        con = DB.get_db()
        cur = con.cursor()
        if (CurrencyDAO.retrieve(currency) != None):
            return
        cur.execute("INSERT INTO currency (symbol, usd_value) VALUES (?, ?)", (currency.symbol, currency.usd_value))
        con.commit()
        con.close()  
    
    def retrieve(currency):
        con = DB.get_db()
        cur = con.cursor()
        row = cur.execute("SELECT * FROM currency WHERE symbol = ?", (currency.symbol))
        return row;
    
    def update(currency):
        con = DB.get_db()
        cur = con.cursor()
        cur.execute("UPDATE currency SET usd_value = ? WHERE symbol = ?", (currency.usd_value, currency.symbol))
        con.commit()
        con.close()
        
    
    def delete(currency):
        con = DB.get_db()
        cur = con.cursor()
        cur.execute("DELETE FROM currency WHERE symbol = ?", (currency.symbol))
        con.commit()
        con.close()
        
        