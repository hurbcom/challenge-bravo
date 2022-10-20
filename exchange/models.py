from django.db import models


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Coin(BaseModel):
    name = models.CharField(max_length=10, unique=True, blank=False, null=False)

    def __str__(self):
        return self.name
