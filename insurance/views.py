from django.conf import settings
from django.shortcuts import render
from rest_framework import viewsets, status, generics
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from insurance.models import Insurance, Agent, Client
from insurance.serializers import (
    InsuranceListSerializer,
    InsuranceDetailSerializer, AgentListSerializer, ClientRetrieveSerializer
)

import redis

from user.models import User


class InsurancePagination(PageNumberPagination):
    page_size = 100
    page_size_query_params = "page_size"
    max_page_size = 100


class InsuranceViewSet(viewsets.ModelViewSet):
    queryset = Insurance.objects.select_related("type", "status")
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, )
    serializer_class = InsuranceListSerializer
    pagination_class = InsurancePagination

    def get_queryset(self):
        queryset = self.queryset

        if self.request.user:
            queryset = queryset.filter(client=self.request.user.id)

        insurance_number = self.request.query_params.get("search")
        if insurance_number:
            queryset = queryset.filter(number=insurance_number)

        return queryset

    def get_serializer_class(self):
        if self.action == "retrieve":
            return InsuranceDetailSerializer

        return InsuranceListSerializer


class AgentPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = "page_size"
    max_page_size = 100


class AgentViewSet(viewsets.ModelViewSet):
    queryset = Agent.objects.select_related("user")
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated,)
    pagination_class = AgentPagination

    def get_serializer_class(self):
        return AgentListSerializer


def connect_to_redis():
    return redis.StrictRedis.from_url(settings.CACHES["default"]["LOCATION"])


class RedisAgentStatisticsView(APIView):
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAdminUser, )

    def post(self, request, *args, **kwargs):
        agent = self.request.query_params.get("agent")

        if not agent:
            return Response(
                {"message": "Agent not specified!"},
                status=status.HTTP_400_BAD_REQUEST
            )

        data_to_store = request.data.get("sales_coef", "")

        connect_to_redis().set(f"{agent}:sales_coef", data_to_store)

        return Response({"message": "Data stored in Redis"}, status=status.HTTP_201_CREATED)

    def get(self, request, *args, **kwargs):
        agent = self.request.query_params.get("agent")

        if not agent:
            return Response(
                {"message": "Agent not specified!"},
                status=status.HTTP_400_BAD_REQUEST
            )

        agent_sales_coef = connect_to_redis().get(f"{agent}:sales_coef")

        return Response({"agent_sales_coef": float(agent_sales_coef)}, status=status.HTTP_200_OK)


class CurrentClientRetrieveView(generics.RetrieveAPIView):
    serializer_class = ClientRetrieveSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user.client


class ClientRetrieveView(generics.RetrieveAPIView):
    serializer_class = ClientRetrieveSerializer
    authentication_classes = (TokenAuthentication, )
    permission_classes = (IsAdminUser, )

    def get_object(self):
        return Client.objects.get(user_id=self.kwargs["pk"])
