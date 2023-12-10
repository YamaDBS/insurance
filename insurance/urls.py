from django.urls import path, include
from rest_framework import routers

from insurance.views import InsuranceViewSet, AgentViewSet, RedisAgentStatisticsView, ClientRetrieveView

router = routers.DefaultRouter()
router.register("insurances", InsuranceViewSet)
router.register("agents", AgentViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("redis/", RedisAgentStatisticsView.as_view(), name="agent-statistics"),
    path("me/", ClientRetrieveView.as_view(), name="client-retrieve"),
]

app_name = "insurance"
