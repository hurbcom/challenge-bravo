from rest_framework import viewsets
from core.service.PaginatorService import PaginatorService

class CoreViewSets(viewsets.ViewSet, PaginatorService):
    pass