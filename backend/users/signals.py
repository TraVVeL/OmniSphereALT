from django.db.models.signals import post_save
from django.dispatch import receiver
from backend.users.models import ExtendedUser, UserSettings


@receiver(post_save, sender=ExtendedUser)
def create_user_settings(sender, instance, created, **kwargs):
    if created:
        UserSettings.objects.create(user=instance)
