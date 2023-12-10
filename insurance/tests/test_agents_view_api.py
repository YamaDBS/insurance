from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status

from rest_framework.test import APIClient

from insurance.models import Agent
from insurance.serializers import AgentListSerializer

AGENTS_URL = reverse("insurance:agent-list")


class UnauthorizedAgentTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_auth_required(self):
        response = self.client.get(AGENTS_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class AuthorizedAgentTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            email="test@user.com",
            password="test12345"
        )
        self.client.force_authenticate(self.user)

    def test_agent_list(self):
        response = self.client.get(AGENTS_URL)
        agents = Agent.objects.all()
        serializer = AgentListSerializer(agents, many=True)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["results"], serializer.data)
