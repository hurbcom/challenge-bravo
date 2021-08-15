from django_filters import FilterSet, CharFilter
from django.db.models import Q


class SearchFilterSet(FilterSet):
    q = CharFilter(field_name='q', method='filter_q')

    class Meta:
        search_fields = []

    def filter_q(cls, queryset, name, value):
        search_fields = getattr(cls.Meta, 'search_fields', None)

        if search_fields:
            queries = Q()
            for field in search_fields:
                queries |= Q(**{field: value})
            return queryset.filter(queries)

        return queryset
