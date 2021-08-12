import uuid
from django.db import models
from django.utils.translation import gettext_lazy as _


class MyCoin(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(
        auto_now_add=True, verbose_name=_('Created at')
    )
    updated_at = models.DateTimeField(
        auto_now=True, verbose_name=_('Updated at')
    )
    codecoin = models.CharField(verbose_name=_('Code Coin'), max_length=4)
    namecoin = models.CharField(verbose_name=_('Name Coin'), max_length=50)
    price = models.FloatField(verbose_name=_('Price USD Coin'), default=0)

    class Meta:
        verbose_name = _('My Coin')
        verbose_name_plural = _('My Coins')
        ordering = ('namecoin',)
        constraints = [
            models.UniqueConstraint(
                fields=['codecoin'],
                name='unique_mycoin_codecoin'
            )
        ]

    def __str__(self) -> str:
        return self.codecoin
