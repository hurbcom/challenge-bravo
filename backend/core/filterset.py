from backend.filterset import SearchFilterSet
from .models import MyCoin


class MyCoinFilter(SearchFilterSet):

    class Meta:
        model = MyCoin
        fields = ['q']
        search_fields = [
            'codecoin__icontains',
            'namecoin__icontains'
        ]
