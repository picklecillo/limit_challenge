import pytest
from django.urls import reverse

from submissions.models import Broker
from submissions.pagination import TotalPageNumberPagination


LIST_URL = reverse("broker-list")


@pytest.fixture
def broker(db):
    return Broker.objects.create(name="Acme Brokerage", primary_contact_email="broker@acme.com")


@pytest.mark.django_db
class TestBrokerListStatus:
    def test_returns_200(self, client, broker):
        response = client.get(LIST_URL)
        assert response.status_code == 200

    def test_empty_list(self, client, db):
        response = client.get(LIST_URL)
        assert response.status_code == 200
        assert response.data["results"] == []

    def test_returns_all_brokers(self, client, db):
        Broker.objects.create(name="Alpha Brokers")
        Broker.objects.create(name="Beta Brokers")
        response = client.get(LIST_URL)
        assert len(response.data["results"]) == 2


@pytest.mark.django_db
class TestBrokerListShape:
    def test_response_fields(self, client, broker):
        response = client.get(LIST_URL)
        item = response.data["results"][0]
        assert set(item.keys()) == {"id", "name", "primary_contact_email"}

    def test_primary_contact_email_null_when_blank(self, client, db):
        Broker.objects.create(name="No Email Broker")
        item = client.get(LIST_URL).data["results"][0]
        assert item["primary_contact_email"] == ""

    def test_ordered_by_name(self, client, db):
        Broker.objects.create(name="Zeta Brokers")
        Broker.objects.create(name="Alpha Brokers")
        results = client.get(LIST_URL).data["results"]
        names = [r["name"] for r in results]
        assert names == sorted(names)


@pytest.mark.django_db
class TestBrokerListPagination:
    def test_response_includes_total_pages(self, client, broker):
        response = client.get(LIST_URL)
        assert "total_pages" in response.data

    def test_total_pages_single_page(self, client, broker):
        response = client.get(LIST_URL)
        assert response.data["total_pages"] == 1

    def test_total_pages_multiple_pages(self, client, db):
        page_size = TotalPageNumberPagination.page_size
        Broker.objects.bulk_create([
            Broker(name=f"Broker {i:02d}") for i in range(page_size + 1)
        ])
        response = client.get(LIST_URL)
        assert response.data["total_pages"] == 2

    def test_total_pages_empty_list(self, client, db):
        response = client.get(LIST_URL)
        assert response.data["total_pages"] == 1
