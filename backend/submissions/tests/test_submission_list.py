import pytest
from django.urls import reverse

from submissions.models import Broker, Company, Document, Note, Submission, TeamMember
from submissions.pagination import TotalPageNumberPagination



LIST_URL = reverse("submission-list")


@pytest.fixture
def broker(db):
    return Broker.objects.create(name="Acme Brokerage", primary_contact_email="broker@acme.com")


@pytest.fixture
def company(db):
    return Company.objects.create(legal_name="Widgets Inc.", industry="Manufacturing")


@pytest.fixture
def owner(db):
    return TeamMember.objects.create(full_name="Alice Smith", email="alice@example.com")


@pytest.fixture
def submission(broker, company, owner):
    return Submission.objects.create(
        company=company,
        broker=broker,
        owner=owner,
        status=Submission.Status.NEW,
        priority=Submission.Priority.HIGH,
        summary="Test submission",
    )


@pytest.mark.django_db
class TestSubmissionListStatus:
    def test_returns_200(self, client, submission):
        response = client.get(LIST_URL)
        assert response.status_code == 200

    def test_returns_all_submissions(self, client, submission, broker, company, owner):
        Submission.objects.create(
            company=company, broker=broker, owner=owner, status=Submission.Status.CLOSED
        )
        response = client.get(LIST_URL)
        assert len(response.data["results"]) == 2

    def test_empty_list(self, client, db):
        response = client.get(LIST_URL)
        assert response.status_code == 200
        assert response.data["results"] == []


@pytest.mark.django_db
class TestSubmissionListShape:
    def test_response_fields(self, client, submission):
        response = client.get(LIST_URL)
        item = response.data["results"][0]
        expected_fields = {
            "id", "status", "priority", "summary", "created_at", "updated_at",
            "broker", "company", "owner", "document_count", "note_count", "latest_note",
        }
        assert expected_fields == set(item.keys())

    def test_nested_broker_fields(self, client, submission):
        item = client.get(LIST_URL).data["results"][0]
        assert set(item["broker"].keys()) == {"id", "name", "primary_contact_email"}

    def test_nested_company_fields(self, client, submission):
        item = client.get(LIST_URL).data["results"][0]
        assert set(item["company"].keys()) == {"id", "legal_name", "industry", "headquarters_city"}

    def test_nested_owner_fields(self, client, submission):
        item = client.get(LIST_URL).data["results"][0]
        assert set(item["owner"].keys()) == {"id", "full_name", "email"}


@pytest.mark.django_db
class TestSubmissionListCounts:
    def test_document_count_zero_when_no_documents(self, client, submission):
        item = client.get(LIST_URL).data["results"][0]
        assert item["document_count"] == 0

    def test_note_count_zero_when_no_notes(self, client, submission):
        item = client.get(LIST_URL).data["results"][0]
        assert item["note_count"] == 0

    def test_note_count_reflects_actual_notes(self, client, submission):
        Note.objects.create(submission=submission, author_name="Bob", body="First note")
        Note.objects.create(submission=submission, author_name="Carol", body="Second note")
        item = client.get(LIST_URL).data["results"][0]
        assert item["note_count"] == 2


@pytest.mark.django_db
class TestSubmissionListLatestNote:
    def test_latest_note_null_when_no_notes(self, client, submission):
        item = client.get(LIST_URL).data["results"][0]
        assert item["latest_note"] is None

    def test_latest_note_present_when_note_exists(self, client, submission):
        Note.objects.create(submission=submission, author_name="Bob", body="A note")
        item = client.get(LIST_URL).data["results"][0]
        assert item["latest_note"] is not None

    def test_latest_note_fields(self, client, submission):
        Note.objects.create(submission=submission, author_name="Bob", body="A note")
        latest_note = client.get(LIST_URL).data["results"][0]["latest_note"]
        assert set(latest_note.keys()) == {"author_name", "body_preview", "created_at"}

    def test_latest_note_is_most_recent(self, client, submission):
        Note.objects.create(submission=submission, author_name="Old Author", body="Older note")
        Note.objects.create(submission=submission, author_name="New Author", body="Newer note")
        latest_note = client.get(LIST_URL).data["results"][0]["latest_note"]
        assert latest_note["author_name"] == "New Author"

    def test_latest_note_body_preview_truncated_at_200_chars(self, client, submission):
        long_body = "x" * 300
        Note.objects.create(submission=submission, author_name="Bob", body=long_body)
        latest_note = client.get(LIST_URL).data["results"][0]["latest_note"]
        assert len(latest_note["body_preview"]) == 200


@pytest.mark.django_db
class TestSubmissionListFilter:
    def test_filter_by_status_returns_matching(self, client, submission, broker, company, owner):
        Submission.objects.create(
            company=company, broker=broker, owner=owner, status=Submission.Status.CLOSED
        )
        response = client.get(LIST_URL, {"status": "new"})
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["status"] == "new"

    def test_filter_by_status_case_insensitive(self, client, submission):
        response = client.get(LIST_URL, {"status": "NEW"})
        assert len(response.data["results"]) == 1

    def test_filter_by_status_no_match_returns_empty(self, client, submission):
        response = client.get(LIST_URL, {"status": "lost"})
        assert response.data["results"] == []

    def test_no_filter_returns_all_statuses(self, client, submission, broker, company, owner):
        Submission.objects.create(
            company=company, broker=broker, owner=owner, status=Submission.Status.IN_REVIEW
        )
        response = client.get(LIST_URL)
        statuses = {item["status"] for item in response.data["results"]}
        assert statuses == {"new", "in_review"}

    def test_filter_by_broker_id_returns_matching(self, client, submission, company, owner):
        other_broker = Broker.objects.create(name="Other Brokerage")
        Submission.objects.create(company=company, broker=other_broker, owner=owner)
        response = client.get(LIST_URL, {"brokerId": submission.broker_id})
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["broker"]["id"] == submission.broker_id

    def test_filter_by_broker_id_no_match_returns_empty(self, client, submission):
        response = client.get(LIST_URL, {"brokerId": submission.broker_id + 999})
        assert response.data["results"] == []

    def test_filter_by_company_search_returns_matching(self, client, submission, broker, owner):
        other_company = Company.objects.create(legal_name="Global Industries")
        Submission.objects.create(company=other_company, broker=broker, owner=owner)
        response = client.get(LIST_URL, {"companySearch": "Widgets"})
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["company"]["legal_name"] == "Widgets Inc."

    def test_filter_by_company_search_case_insensitive(self, client, submission):
        response = client.get(LIST_URL, {"companySearch": "widgets"})
        assert len(response.data["results"]) == 1

    def test_filter_by_company_search_no_match_returns_empty(self, client, submission):
        response = client.get(LIST_URL, {"companySearch": "nonexistent"})
        assert response.data["results"] == []


@pytest.mark.django_db
class TestSubmissionListHasDocumentsFilter:
    def test_has_documents_true_returns_only_submissions_with_documents(
        self, client, submission, broker, company, owner
    ):
        submission_no_docs = Submission.objects.create(
            company=company, broker=broker, owner=owner, status=Submission.Status.NEW
        )
        Document.objects.create(submission=submission, title="Doc", doc_type="policy", file_url="http://x.com/f")
        response = client.get(LIST_URL, {"hasDocuments": "true"})
        ids = {item["id"] for item in response.data["results"]}
        assert submission.id in ids
        assert submission_no_docs.id not in ids

    def test_has_documents_false_returns_only_submissions_without_documents(
        self, client, submission, broker, company, owner
    ):
        submission_with_docs = Submission.objects.create(
            company=company, broker=broker, owner=owner, status=Submission.Status.NEW
        )
        Document.objects.create(submission=submission_with_docs, title="Doc", doc_type="policy", file_url="http://x.com/f")
        response = client.get(LIST_URL, {"hasDocuments": "false"})
        ids = {item["id"] for item in response.data["results"]}
        assert submission.id in ids
        assert submission_with_docs.id not in ids

    def test_has_documents_true_no_duplicates_when_multiple_documents(
        self, client, submission
    ):
        Document.objects.create(submission=submission, title="Doc 1", doc_type="policy", file_url="http://x.com/1")
        Document.objects.create(submission=submission, title="Doc 2", doc_type="policy", file_url="http://x.com/2")
        response = client.get(LIST_URL, {"hasDocuments": "true"})
        assert len(response.data["results"]) == 1

    def test_has_documents_omitted_returns_all(self, client, submission, broker, company, owner):
        submission_with_docs = Submission.objects.create(
            company=company, broker=broker, owner=owner
        )
        Document.objects.create(submission=submission_with_docs, title="Doc", doc_type="policy", file_url="http://x.com/f")
        response = client.get(LIST_URL)
        assert len(response.data["results"]) == 2


@pytest.mark.django_db
class TestSubmissionListFilterCombined:
    def test_status_and_broker_id_both_match(self, client, submission, company, owner):
        other_broker = Broker.objects.create(name="Other Brokerage")
        Submission.objects.create(
            company=company, broker=other_broker, owner=owner, status=Submission.Status.NEW
        )
        Submission.objects.create(
            company=company, broker=submission.broker, owner=owner, status=Submission.Status.CLOSED
        )
        response = client.get(LIST_URL, {"status": "new", "brokerId": submission.broker_id})
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["id"] == submission.id

    def test_status_and_broker_id_no_match(self, client, submission, company, owner):
        other_broker = Broker.objects.create(name="Other Brokerage")
        response = client.get(LIST_URL, {"status": "new", "brokerId": other_broker.id})
        assert response.data["results"] == []

    def test_status_and_company_search_both_match(self, client, submission, broker, owner):
        other_company = Company.objects.create(legal_name="Global Industries")
        Submission.objects.create(
            company=other_company, broker=broker, owner=owner, status=Submission.Status.NEW
        )
        Submission.objects.create(
            company=submission.company, broker=broker, owner=owner, status=Submission.Status.CLOSED
        )
        response = client.get(LIST_URL, {"status": "new", "companySearch": "Widgets"})
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["id"] == submission.id

    def test_broker_id_and_company_search_both_match(self, client, submission, owner):
        other_broker = Broker.objects.create(name="Other Brokerage")
        other_company = Company.objects.create(legal_name="Global Industries")
        Submission.objects.create(company=other_company, broker=submission.broker, owner=owner)
        Submission.objects.create(company=submission.company, broker=other_broker, owner=owner)
        response = client.get(LIST_URL, {"brokerId": submission.broker_id, "companySearch": "Widgets"})
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["id"] == submission.id

    def test_all_three_filters_combined(self, client, submission, owner):
        other_broker = Broker.objects.create(name="Other Brokerage")
        other_company = Company.objects.create(legal_name="Global Industries")
        Submission.objects.create(
            company=other_company, broker=submission.broker, owner=owner, status=Submission.Status.NEW
        )
        Submission.objects.create(
            company=submission.company, broker=other_broker, owner=owner, status=Submission.Status.NEW
        )
        Submission.objects.create(
            company=submission.company, broker=submission.broker, owner=owner, status=Submission.Status.CLOSED
        )
        response = client.get(LIST_URL, {
            "status": "new",
            "brokerId": submission.broker_id,
            "companySearch": "Widgets",
        })
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["id"] == submission.id


@pytest.mark.django_db
class TestSubmissionPagination:
    def _bulk_create(self, n, broker, company, owner):
        Submission.objects.bulk_create([
            Submission(company=company, broker=broker, owner=owner, status=Submission.Status.NEW)
            for _ in range(n)
        ])

    def test_response_includes_total_pages(self, client, submission):
        response = client.get(LIST_URL)
        assert "total_pages" in response.data

    def test_total_pages_single_page(self, client, submission):
        response = client.get(LIST_URL)
        assert response.data["total_pages"] == 1

    def test_total_pages_multiple_pages(self, client, submission, broker, company, owner):
        page_size = TotalPageNumberPagination.page_size
        self._bulk_create(page_size, broker, company, owner)
        response = client.get(LIST_URL)
        assert response.data["total_pages"] == 2

    def test_second_page_returns_remaining_results(self, client, submission, broker, company, owner):
        page_size = TotalPageNumberPagination.page_size
        self._bulk_create(page_size, broker, company, owner)
        response = client.get(LIST_URL, {"page": 2})
        assert len(response.data["results"]) == 1

    def test_total_pages_empty_list(self, client, db):
        response = client.get(LIST_URL)
        assert response.data["total_pages"] == 1

