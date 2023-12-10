from django.urls import path, include
from rest_framework import routers

from insurance.views import InsuranceViewSet, AgentViewSet, RedisAgentStatisticsView

router = routers.DefaultRouter()
router.register("insurances", InsuranceViewSet)
router.register("agents", AgentViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("redis/", RedisAgentStatisticsView.as_view(), name="agent-statistics")
]

app_name = "insurance"
