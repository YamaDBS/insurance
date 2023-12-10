import datetime

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status

from rest_framework.test import APIClient

from insurance.models import Insurance, InsuranceStatus, InsuranceType, Client
from insurance.serializers import InsuranceListSerializer


INSURANCE_URL = reverse("insurance:insurance-list")


class UnauthorizedInsuranceTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_auth_required(self):
        response = self.client.get(INSURANCE_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class AuthorizedInsuranceTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            email="test@user.com",
            password="test12345"
        )
        self.client.force_authenticate(self.user)

        self.insurance_status = InsuranceStatus.objects.create(name="status")
        self.insurance_type = InsuranceType.objects.create(name="type")

        self.insurance_client = Client.objects.create(
            user=self.user,
            birth_date=datetime.date(year=2011, month=1, day=1),
            income=1000,
            weight=100,
        )

        self.insurance = Insurance.objects.create(
            number="AA11111AA",
            price=500,
            coverage=10000,
            start_date=datetime.date(year=2011, month=1, day=1),
            end_date=datetime.date(year=2012, month=1, day=1),
            status=self.insurance_status,
            type=self.insurance_type,
            client=self.insurance_client
        )

    def test_insurance_list(self):
        response = self.client.get(INSURANCE_URL)
        insurances = Insurance.objects.all()
        serializer = InsuranceListSerializer(insurances, many=True)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["results"], serializer.data)

    def test_insurance_list_only_for_specific_client(self):
        user = get_user_model().objects.create_user(
            email="another@user.com",
            password="12345another"
        )
        self.client.force_authenticate(user)

        client = Client.objects.create(
            user=user,
            birth_date=datetime.date(year=2011, month=1, day=1),
            income=1000,
            weight=80
        )

        response = self.client.get(INSURANCE_URL)
        insurances = Insurance.objects.all()
        serializer = InsuranceListSerializer(insurances, many=True)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEqual(response.data["results"], serializer.data)

    def test_insurance_list_search(self):
        response = self.client.get(INSURANCE_URL,
                                   {"search": "AA11111AA"})

        serializer = InsuranceListSerializer(self.insurance)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([serializer.data], response.data["results"])

