from django.db import models
from django.utils import timezone

from user.models import User


class InsuranceType(models.Model):
    name = models.CharField(max_length=63)

    def __str__(self) -> str:
        return self.name

    class Meta:
        ordering = ["name"]
        verbose_name = "insurance type"
        verbose_name_plural = "insurance types"


class InsuranceStatus(models.Model):
    name = models.CharField(max_length=63)

    def __str__(self) -> str:
        return self.name

    class Meta:
        ordering = ["name"]
        verbose_name = "insurance status"
        verbose_name_plural = "insurance statuses"


class Agent(models.Model):
    user = models.OneToOneField(User,
                                related_name="agent",
                                on_delete=models.CASCADE,
                                primary_key=True)

    class Meta:
        verbose_name = "agent"
        verbose_name_plural = "agents"

    def __str__(self) -> str:
        return f"{self.user.first_name} {self.user.last_name} (Agent)"


class Client(models.Model):
    user = models.OneToOneField(User,
                                related_name="client",
                                on_delete=models.CASCADE,
                                primary_key=True)

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

    agent = models.ForeignKey(Agent,
                              null=True,
                              related_name="client",
                              on_delete=models.PROTECT)

    def __str__(self) -> str:
        return f"{self.user.first_name} {self.user.last_name}"


class Insurance(models.Model):
    number = models.CharField(max_length=9, unique=True)

    name = models.CharField(max_length=63, unique=True)
    description = models.TextField()

    price = models.FloatField()
    coverage = models.FloatField()

    type = models.ForeignKey(
        InsuranceType, related_name="insurance", on_delete=models.CASCADE
    )
    status = models.ForeignKey(
        InsuranceStatus, related_name="insurance", on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(default=timezone.now(), editable=False)

    start_date = models.DateField()
    end_date = models.DateField()

    client = models.ForeignKey(Client,
                               null=True,
                               related_name="insurances",
                               on_delete=models.CASCADE)

    @property
    def days_left(self) -> int:
        return (self.end_date - self.start_date).days

    def __str__(self) -> str:
        return f"{self.number} ({self.name})"

