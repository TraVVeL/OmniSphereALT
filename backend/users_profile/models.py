from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models

from django.conf import settings


class AdditionalUserInfo(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('N', 'None'),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(max_length=500, blank=True, null=True, verbose_name='Describe yourself')
    specialty = models.CharField(max_length=50, blank=True, null=True, verbose_name='Specialty')
    gender = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES,
        blank=True,
        default='N',
        verbose_name='Gender'
    )

    age = models.PositiveIntegerField(
        blank=True,
        null=True,
        verbose_name='Age',
        validators=[MinValueValidator(0), MaxValueValidator(150)]
    )

    phone_number = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name='Phone number'
    )

    def __str__(self):
        return f'Additional info of {self.user.get_username()}'


class Location(models.Model):
    user = models.OneToOneField(AdditionalUserInfo, on_delete=models.CASCADE, related_name='location')
    country = models.CharField(max_length=255, blank=True, null=True, verbose_name='Country')
    region = models.CharField(max_length=255, blank=True, null=True, verbose_name='Region')
    city = models.CharField(max_length=255, blank=True, null=True, verbose_name='City')


class SocialLinks(models.Model):
    user = models.OneToOneField(AdditionalUserInfo, on_delete=models.CASCADE, related_name='social_links')
    google_link = models.URLField(blank=True, null=True, verbose_name='Google link')
    telegram_link = models.URLField(blank=True, null=True, verbose_name='Telegram link')
    github_link = models.URLField(blank=True, null=True, verbose_name='GitHub link')
    head_hunter_link = models.URLField(blank=True, null=True, verbose_name='HeadHunter link')
    habr_link = models.URLField(blank=True, null=True, verbose_name='Habr link')
