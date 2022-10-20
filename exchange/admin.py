from django.contrib import admin
from .models import Coin


@admin.register(Coin)
class CoinAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "created_at", "updated_at"]
    list_display_links = ["id", "name"]
    list_per_page = 20
    search_fields = ["name"]
