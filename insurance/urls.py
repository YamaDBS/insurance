from django.urls import path, include
from rest_framework import routers

from insurance.views import InsuranceViewSet

router = routers.DefaultRouter()
router.register("insurances", InsuranceViewSet)

urlpatterns = [
    path("", include(router.urls))
]

app_name = "insurance"
