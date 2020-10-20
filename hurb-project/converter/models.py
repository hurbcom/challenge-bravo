# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models


class Currency(models.Model):
    symbol = models.CharField(max_length=5, null=True, blank=True, default=None)
    description = models.CharField(max_length=50, null=True, blank=True, default=None)

    class Meta():
        db_table = 'currency'
