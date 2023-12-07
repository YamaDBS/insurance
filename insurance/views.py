from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.pagination import PageNumberPagination

from insurance.models import Insurance
from insurance.serializers import InsuranceListSerializer, InsuranceDetailSerializer


class InsurancePagination(PageNumberPagination):
    page_size = 100
    page_size_query_params = "page_size"
    max_page_size = 100


class InsuranceViewSet(viewsets.ModelViewSet):
    queryset = Insurance.objects.select_related("type", "status")
    authentication_classes = (TokenAuthentication, )
    serializer_class = InsuranceListSerializer
    pagination_class = InsurancePagination

    def get_queryset(self):
        queryset = self.queryset

        if self.request.user:
            queryset = queryset.filter(client=self.request.user.id)

        return queryset

    def get_serializer_class(self):
        if self.action == "retrieve":
            return InsuranceDetailSerializer

        return InsuranceListSerializer


