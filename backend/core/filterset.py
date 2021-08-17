from backend.filterset import SearchFilterSet
from django_filters import FilterSet, CharFilter

from .models import MyCoin


class MyCoinFilter(SearchFilterSet):

    class Meta:
        model = MyCoin
        fields = ['q']
        search_fields = [
            'codecoin__icontains',
            'namecoin__icontains'
        ]


class ConvertFilter(FilterSet):
    from_coin = CharFilter()
    to = CharFilter()
    amount = CharFilter()
