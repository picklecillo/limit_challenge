import pytest
from django.urls import reverse

from submissions.models import Broker, Company, Contact, Document, Note, Submission, TeamMember


def detail_url(pk):
    return reverse("submission-detail", args=[pk])


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
class TestSubmissionDetailStatus:
    def test_returns_200(self, client, submission):
        response = client.get(detail_url(submission.pk))
        assert response.status_code == 200

    def test_unknown_id_returns_404(self, client, db):
        response = client.get(detail_url(99999))
        assert response.status_code == 404

    def test_returns_correct_submission(self, client, submission, broker, company, owner):
        other = Submission.objects.create(
            company=company, broker=broker, owner=owner, status=Submission.Status.CLOSED
        )
        response = client.get(detail_url(submission.pk))
        assert response.data["id"] == submission.pk
        assert response.data["id"] != other.pk


@pytest.mark.django_db
class TestSubmissionDetailShape:
    def test_response_fields(self, client, submission):
        response = client.get(detail_url(submission.pk))
        expected_fields = {
            "id", "status", "priority", "summary", "created_at", "updated_at",
            "broker", "company", "owner", "contacts", "documents", "notes",
        }
        assert expected_fields == set(response.data.keys())

    def test_no_annotation_fields(self, client, submission):
        response = client.get(detail_url(submission.pk))
        list_only = {"document_count", "note_count", "latest_note"}
        assert list_only.isdisjoint(response.data.keys())

    def test_nested_broker_fields(self, client, submission):
        response = client.get(detail_url(submission.pk))
        assert set(response.data["broker"].keys()) == {"id", "name", "primary_contact_email"}

    def test_nested_company_fields(self, client, submission):
        response = client.get(detail_url(submission.pk))
        assert set(response.data["company"].keys()) == {"id", "legal_name", "industry", "headquarters_city"}

    def test_nested_owner_fields(self, client, submission):
        response = client.get(detail_url(submission.pk))
        assert set(response.data["owner"].keys()) == {"id", "full_name", "email"}


@pytest.mark.django_db
class TestSubmissionDetailContacts:
    def test_contacts_empty_list_when_none(self, client, submission):
        response = client.get(detail_url(submission.pk))
        assert response.data["contacts"] == []

    def test_contacts_includes_all(self, client, submission):
        Contact.objects.create(submission=submission, name="Bob", role="CFO", email="bob@example.com")
        Contact.objects.create(submission=submission, name="Carol", role="CTO")
        response = client.get(detail_url(submission.pk))
        assert len(response.data["contacts"]) == 2

    def test_contact_fields(self, client, submission):
        Contact.objects.create(submission=submission, name="Bob", role="CFO", email="bob@example.com", phone="555-0100")
        contact = client.get(detail_url(submission.pk)).data["contacts"][0]
        assert set(contact.keys()) == {"id", "name", "role", "email", "phone"}

    def test_contacts_belong_to_submission(self, client, submission, broker, company, owner):
        other = Submission.objects.create(company=company, broker=broker, owner=owner)
        Contact.objects.create(submission=other, name="Unrelated", role="CEO")
        Contact.objects.create(submission=submission, name="Related", role="CFO")
        response = client.get(detail_url(submission.pk))
        names = [c["name"] for c in response.data["contacts"]]
        assert names == ["Related"]


@pytest.mark.django_db
class TestSubmissionDetailDocuments:
    def test_documents_empty_list_when_none(self, client, submission):
        response = client.get(detail_url(submission.pk))
        assert response.data["documents"] == []

    def test_documents_includes_all(self, client, submission):
        Document.objects.create(submission=submission, title="Financials", doc_type="pdf")
        Document.objects.create(submission=submission, title="Application", doc_type="pdf")
        response = client.get(detail_url(submission.pk))
        assert len(response.data["documents"]) == 2

    def test_document_fields(self, client, submission):
        Document.objects.create(submission=submission, title="Financials", doc_type="pdf", file_url="https://example.com/file.pdf")
        doc = client.get(detail_url(submission.pk)).data["documents"][0]
        assert set(doc.keys()) == {"id", "title", "doc_type", "uploaded_at", "file_url"}

    def test_documents_belong_to_submission(self, client, submission, broker, company, owner):
        other = Submission.objects.create(company=company, broker=broker, owner=owner)
        Document.objects.create(submission=other, title="Other Doc", doc_type="pdf")
        Document.objects.create(submission=submission, title="My Doc", doc_type="pdf")
        response = client.get(detail_url(submission.pk))
        titles = [d["title"] for d in response.data["documents"]]
        assert titles == ["My Doc"]


@pytest.mark.django_db
class TestSubmissionDetailNotes:
    def test_notes_empty_list_when_none(self, client, submission):
        response = client.get(detail_url(submission.pk))
        assert response.data["notes"] == []

    def test_notes_includes_all(self, client, submission):
        Note.objects.create(submission=submission, author_name="Bob", body="Note 1")
        Note.objects.create(submission=submission, author_name="Carol", body="Note 2")
        response = client.get(detail_url(submission.pk))
        assert len(response.data["notes"]) == 2

    def test_note_fields(self, client, submission):
        Note.objects.create(submission=submission, author_name="Bob", body="A note")
        note = client.get(detail_url(submission.pk)).data["notes"][0]
        assert set(note.keys()) == {"id", "author_name", "body", "created_at"}

    def test_notes_ordered_newest_first(self, client, submission):
        Note.objects.create(submission=submission, author_name="First", body="Older")
        Note.objects.create(submission=submission, author_name="Second", body="Newer")
        notes = client.get(detail_url(submission.pk)).data["notes"]
        assert notes[0]["author_name"] == "Second"

    def test_notes_body_not_truncated(self, client, submission):
        long_body = "x" * 500
        Note.objects.create(submission=submission, author_name="Bob", body=long_body)
        note = client.get(detail_url(submission.pk)).data["notes"][0]
        assert note["body"] == long_body

    def test_notes_belong_to_submission(self, client, submission, broker, company, owner):
        other = Submission.objects.create(company=company, broker=broker, owner=owner)
        Note.objects.create(submission=other, author_name="Outsider", body="Not mine")
        Note.objects.create(submission=submission, author_name="Insider", body="Mine")
        notes = client.get(detail_url(submission.pk)).data["notes"]
        assert len(notes) == 1
        assert notes[0]["author_name"] == "Insider"


@pytest.mark.django_db
class TestSubmissionDetailValues:
    def test_status_value(self, client, submission):
        assert client.get(detail_url(submission.pk)).data["status"] == "new"

    def test_priority_value(self, client, submission):
        assert client.get(detail_url(submission.pk)).data["priority"] == "high"

    def test_summary_value(self, client, submission):
        assert client.get(detail_url(submission.pk)).data["summary"] == "Test submission"

    def test_broker_name(self, client, submission):
        assert client.get(detail_url(submission.pk)).data["broker"]["name"] == "Acme Brokerage"

    def test_company_legal_name(self, client, submission):
        assert client.get(detail_url(submission.pk)).data["company"]["legal_name"] == "Widgets Inc."

    def test_owner_full_name(self, client, submission):
        assert client.get(detail_url(submission.pk)).data["owner"]["full_name"] == "Alice Smith"
