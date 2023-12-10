from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status

from rest_framework.test import APIClient

from insurance.models import Agent


REDIS_URL = reverse("insurance:agent-statistics")


class UnauthorizedRedisTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_auth_required(self):
        response = self.client.get(REDIS_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class AuthorizedRedisTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_superuser(
            email="agent@user.com",
            password="test12345"
        )
        self.client.force_authenticate(self.user)

        self.agent = Agent.objects.create(
            user=self.user,
        )

    def test_redis_get_agent_statistics(self):
        response = self.client.get(REDIS_URL, {"agent": self.user.email})

        self.assertEqual(response.data, {"agent_sales_coef": 1.0})
