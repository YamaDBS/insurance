from rest_framework import generics, viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.settings import api_settings

from insurance.models import Client, Agent
from insurance.permissions import IsAgentUserOrIsAdminUser
from user.models import User
from user.serializers import UserSerializer, AuthTokenSerializer


class CreateUserView(generics.CreateAPIView):
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        user.first_name = user.email.split("@")[0]

        if user.is_client:
            Client.objects.create(user=user)

        if user.is_agent:
            Agent.objects.create(user=user)


class CreateTokenView(ObtainAuthToken):
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES
    serializer_class = AuthTokenSerializer


class ManageUserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user


class UserPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = "page_size"
    max_page_size = 100


class UserListView(viewsets.ModelViewSet):
    queryset = User.objects.all()

    serializer_class = UserSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAgentUserOrIsAdminUser, )
    pagination_class = UserPagination

    def get_queryset(self):
        queryset = self.queryset

        email = self.request.query_params.get("search")
        if email:
            queryset = queryset.filter(email__icontains=email)

        return queryset
