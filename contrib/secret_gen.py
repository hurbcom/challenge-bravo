#!/usr/bin/env python
"""
Django SECRET_KEY generator
"""
from django.utils.crypto import get_random_string

def generate():
    chars = 'abcdefghijklmnopqrstuvxyz0123456789!@#$%^&*(-_=+)'
    return get_random_string(50, chars)
