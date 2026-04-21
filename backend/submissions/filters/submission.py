import django_filters

from submissions import models


class SubmissionFilterSet(django_filters.FilterSet):
    """Basic filter set for the submissions list endpoint.

    Only the status filter is implemented so the candidate can extend the
    remaining filters (broker, company search, optional extras, etc.).
    """

    status = django_filters.CharFilter(field_name="status", lookup_expr="iexact")
    brokerId = django_filters.NumberFilter(field_name="broker_id")
    companySearch = django_filters.CharFilter(field_name="company__legal_name", lookup_expr="icontains")
    hasDocuments = django_filters.BooleanFilter(method="filter_has_documents")

    def filter_has_documents(self, queryset, name, value):
        if value is True:
            return queryset.filter(documents__isnull=False).distinct()
        if value is False:
            return queryset.filter(documents__isnull=True)
        return queryset

    class Meta:
        model = models.Submission
        fields = ["status", "broker_id", "company__legal_name", "hasDocuments"]

