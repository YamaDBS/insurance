from django.urls import path

from user.views import (
    CreateUserView,
    CreateTokenView,
    ManageUserView,
    UserListView
)


urlpatterns = [
    path("register/", CreateUserView.as_view(), name="register"),
    path("login/", CreateTokenView.as_view(), name="login"),
    path("me/", ManageUserView.as_view(), name="manage"),
    path("all/", UserListView.as_view(), name="all"),
]

app_name = "user"
