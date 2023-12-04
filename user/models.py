from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    is_agent = models.BooleanField(default=False)
    is_client = models.BooleanField(default=False)
