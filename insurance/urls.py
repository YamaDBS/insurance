from django.urls import path, include
from rest_framework import routers

from insurance.views import InsuranceViewSet, AgentViewSet, RedisUserView

router = routers.DefaultRouter()
router.register("insurances", InsuranceViewSet)
router.register("agents", AgentViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("redis/", RedisUserView.as_view(), name="redis-user")
]

app_name = "insurance"
