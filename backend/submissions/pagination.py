import math

from django.conf import settings
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class SubmissionPagination(PageNumberPagination):
    page_size = settings.REST_FRAMEWORK.get("PAGE_SIZE", 10)

    def get_paginated_response(self, data):
        total_count = self.page.paginator.count
        total_pages = math.ceil(total_count / self.get_page_size(self.request)) or 1

        return Response({
            "count": total_count,
            "total_pages": total_pages,
            "next": self.get_next_link(),
            "previous": self.get_previous_link(),
            "results": data,
        })
