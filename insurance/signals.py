from django.db.models.signals import post_save
from django.dispatch import receiver

from insurance.models import Client, Agent
from user.models import User


@receiver(post_save, sender=User)
def create_client_after_user_created(sender, instance, created, **kwargs):
    if created and instance.is_client:
        Client.objects.create(user=instance)
    if created and instance.is_agent:
        Agent.objects.create(user=instance)


post_save.connect(create_client_after_user_created, sender=User)
