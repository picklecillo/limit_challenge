from django.db.models import Count, OuterRef, Subquery
from rest_framework import viewsets

from submissions import models, serializers
from submissions.filters.submission import SubmissionFilterSet
from submissions.pagination import TotalPageNumberPagination


class SubmissionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.Submission.objects.all()
    filterset_class = SubmissionFilterSet
    pagination_class = TotalPageNumberPagination

    def get_queryset(self):
        queryset = super().get_queryset().select_related("broker", "company", "owner").order_by("-updated_at")

        if self.action == "retrieve":
            queryset = queryset.prefetch_related("contacts", "documents", "notes")

        if self.action == "list":
            latest_note = models.Note.objects.filter(submission_id=OuterRef("pk")).order_by("-created_at")
            queryset = queryset.annotate(
                document_count=Count("documents", distinct=True),
                note_count=Count("notes", distinct=True),
                latest_note_author=Subquery(latest_note.values("author_name")[:1]),
                latest_note_body=Subquery(latest_note.values("body")[:1]),
                latest_note_created_at=Subquery(latest_note.values("created_at")[:1]),
            )

        return queryset

    def get_serializer_class(self):
        if self.action == "list":
            return serializers.SubmissionListSerializer
        return serializers.SubmissionDetailSerializer


class BrokerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.Broker.objects.all()
    serializer_class = serializers.BrokerSerializer
    pagination_class = TotalPageNumberPagination

