from django.contrib.auth.models import AbstractUser
from django.db import models
import datetime


class InsuranceType(models.Model):
    name = models.CharField(max_length=63)

    def __str__(self) -> str:
        return self.name


class InsuranceStatus(models.Model):
    name = models.CharField(max_length=63)

    def __str__(self) -> str:
        return self.name


class Insurance(models.Model):
    name = models.CharField(max_length=63, unique=True)
    description = models.TextField()

    price = models.FloatField()
    coverage = models.FloatField()

    type = models.ForeignKey(
        InsuranceType,
        related_name="insurance",
        on_delete=models.CASCADE
    )
    status = models.ForeignKey(
        InsuranceStatus,
        related_name="insurance",
        on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(auto_now_add=True)

    start_date = models.DateField()
    end_date = models.DateField()

    @property
    def days_left(self) -> int:
        return (self.end_date - self.start_date).days


class Agent(AbstractUser):
    class Meta:
        verbose_name = "agent"
        verbose_name_plural = "agents"


class Client(AbstractUser):
    phone_number = models.CharField(max_length=31)
    passport_number = models.CharField(max_length=31)
    address = models.CharField(max_length=255)
    birth_date = models.DateField()

    profession = models.CharField(max_length=63)
    income = models.IntegerField()

    class Sex(models.TextChoices):
        MALE = "Male"
        FEMALE = "Female"

    sex = models.CharField(max_length=15, choices=Sex.choices)

    weight = models.FloatField()
    illness = models.CharField(max_length=255)
    bad_habits = models.CharField(max_length=255)
    surgeries = models.CharField(max_length=255)

    class Meta:
        verbose_name = "client"
        verbose_name_plural = "clients"

    agent = models.ForeignKey(
        Agent,
        related_name="client",
        on_delete=models.CASCADE
    )
