from django.urls import path, include
from rest_framework import routers

from user.views import (
    CreateUserView,
    CreateTokenView,
    ManageUserView,
    UserListView
)

router = routers.DefaultRouter()
router.register("all", UserListView)

urlpatterns = [
    path("register/", CreateUserView.as_view(), name="register"),
    path("login/", CreateTokenView.as_view(), name="login"),
    path("me/", ManageUserView.as_view(), name="manage"),
    path("", include(router.urls))
]

app_name = "user"
