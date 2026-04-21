import pytest
from django.urls import reverse

from submissions.models import Broker


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
        assert response.data == []

    def test_returns_all_brokers(self, client, db):
        Broker.objects.create(name="Alpha Brokers")
        Broker.objects.create(name="Beta Brokers")
        response = client.get(LIST_URL)
        assert len(response.data) == 2


@pytest.mark.django_db
class TestBrokerListShape:
    def test_response_fields(self, client, broker):
        response = client.get(LIST_URL)
        item = response.data[0]
        assert set(item.keys()) == {"id", "name", "primary_contact_email"}

    def test_primary_contact_email_null_when_blank(self, client, db):
        Broker.objects.create(name="No Email Broker")
        item = client.get(LIST_URL).data[0]
        assert item["primary_contact_email"] == ""

    def test_ordered_by_name(self, client, db):
        Broker.objects.create(name="Zeta Brokers")
        Broker.objects.create(name="Alpha Brokers")
        results = client.get(LIST_URL).data
        names = [r["name"] for r in results]
        assert names == sorted(names)
