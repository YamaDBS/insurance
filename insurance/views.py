from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from insurance.models import Insurance, Agent, Client
from insurance.serializers import (
    InsuranceListSerializer,
    InsuranceDetailSerializer, AgentListSerializer
)


class InsurancePagination(PageNumberPagination):
    page_size = 100
    page_size_query_params = "page_size"
    max_page_size = 100


class InsuranceViewSet(viewsets.ModelViewSet):
    queryset = Insurance.objects.select_related("type", "status")
    authentication_classes = (TokenAuthentication,)
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
    pagination_class = AgentPagination

    def get_serializer_class(self):
        return AgentListSerializer
