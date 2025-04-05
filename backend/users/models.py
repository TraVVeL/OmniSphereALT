from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings


class ExtendedUser(AbstractUser):
    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        null=True,
        blank=True,
    )


class ConfirmationCode(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    confirmation_code = models.CharField(max_length=6)
    expired = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.confirmation_code}"


class SocialAuth(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='social_auth')
    google = models.CharField(max_length=255, unique=True, null=True, blank=True, verbose_name="Google ID")
    telegram = models.CharField(max_length=255, unique=True, null=True, blank=True, verbose_name="Telegram ID")
    github = models.CharField(max_length=255, unique=True, null=True, blank=True, verbose_name="GitHub ID")

    class Meta:
        verbose_name_plural = "Social Auths"

    @classmethod
    def get_social_fields(cls):
        return ['google', 'github', 'telegram']


class UserSettings(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    language = models.CharField(max_length=10, default="en", verbose_name="language")
    theme = models.CharField(max_length=10, default="dark", verbose_name="theme")

    def __str__(self):
        return f"{self.user.username}`s settings"
