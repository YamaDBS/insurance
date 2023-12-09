from django.urls import path, include
from rest_framework import routers

from insurance.views import InsuranceViewSet, AgentViewSet

router = routers.DefaultRouter()
router.register("insurances", InsuranceViewSet)
router.register("agents", AgentViewSet)

urlpatterns = [path("", include(router.urls))]

app_name = "insurance"
