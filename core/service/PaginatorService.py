from rest_framework.exceptions import APIException
from rest_framework.pagination import PageNumberPagination

class PaginatorService:

    def paginar(self, query=None, Serializer=None, request=None):
        paginator = PageNumberPagination()
        paginator.page_size = request.query_params['size']
        context = paginator.paginate_queryset(query, request)
        serializer_class = Serializer(context, many=True)
        response = paginator.get_paginated_response(serializer_class.data)
        response.data['num_pages'] = paginator.page.paginator.num_pages
        return response