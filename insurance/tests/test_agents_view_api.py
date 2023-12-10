from django.test import TestCase
from django.urls import reverse
from rest_framework import status

from rest_framework.test import APIClient


INSURANCE_URL = reverse("insurance:insurances")
AGENTS_URL = reverse("insurance:agents")
REDIS_URL = reverse("insurance:agent-statistics")

class UnauthorizedInsuranceTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_auth_required(self):
        response = self.client.get(INSURANCE_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
