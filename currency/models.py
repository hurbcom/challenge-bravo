from django.db import models
from datetime import datetime

class Currency(models.Model):

    name        = models.CharField(max_length=50,)
    shortname   = models.CharField(max_length=3,)
    symbol     = models.CharField(max_length=3, unique=True)
    created_at = models.DateTimeField(default=datetime.now)
    
    def __str__(self):
        return self.name
