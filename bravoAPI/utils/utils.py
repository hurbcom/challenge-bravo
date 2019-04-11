# -*- coding: utf-8 -*-

def is_int_or_float(s):
    ''' retorna 1 para tipo int, 2 para float e -1 se não é numero'''
    try:
        float(s)
        return 1 if s.count('.') == 0 else 2
    except ValueError:
        return -1