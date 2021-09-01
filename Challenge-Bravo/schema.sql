# -*- coding: utf-8 -*-
"""
Created on Tue Aug 31 23:35:49 2021

@author: lucas
"""

IF NOT EXISTS(SELECT name FROM sqlite_master WHERE type='table' and name='currency')
BEGIN
CREATE TABLE currency (symbol TEXT, usd_value REAL)
INSERT INTO currency (symbol, usd_value) VALUES ('USD', 1)
INSERT INTO currency (symbol) VALUES ('BRL')
INSERT INTO currency (symbol) VALUES ('EUR')
INSERT INTO currency (symbol) VALUES ('BTC')
INSERT INTO currency (symbol) VALUES ('ETH')
END

