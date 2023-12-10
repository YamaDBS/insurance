from django.urls import path, include
from rest_framework import routers

from insurance.views import InsuranceViewSet, AgentViewSet, RedisAgentStatisticsView, ClientRetrieveView, \
    CurrentClientRetrieveView

router = routers.DefaultRouter()
router.register("insurances", InsuranceViewSet)
router.register("agents", AgentViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("redis/", RedisAgentStatisticsView.as_view(), name="agent-statistics"),
    path("me/", CurrentClientRetrieveView.as_view(), name="current-client-retrieve"),
    path("clients/<int:pk>", ClientRetrieveView.as_view(), name="client-retrieve")
]

app_name = "insurance"
