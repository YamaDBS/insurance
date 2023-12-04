from django.shortcuts import render
from rest_framework import viewsets

from insurance.models import Insurance
from insurance.serializers import InsuranceListSerializer


class InsuranceViewSet(viewsets.ModelViewSet):
    queryset = Insurance.objects.select_related("type", "status")
    serializer_class = InsuranceListSerializer

    def get_queryset(self):
        queryset = self.queryset

        return queryset
