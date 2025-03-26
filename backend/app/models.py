from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import AbstractUser
from django.db import models

from django.conf import settings


class ExtendedUser(AbstractUser):
    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        null=True,
        blank=True,
        default='profile_pictures/default_profile_picture.png',
    )
    google_id = models.CharField(max_length=255, unique=True, null=True, blank=True, verbose_name="google auth")
    telegram_id = models.CharField(max_length=255, unique=True, null=True, blank=True, verbose_name="telegram auth")
    github_id = models.CharField(max_length=255, unique=True, null=True, blank=True, verbose_name="github auth")


class AdditionalUserInfo(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('N', 'None'),
    ]

    user = models.OneToOneField('ExtendedUser', on_delete=models.CASCADE, related_name='profile')
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

    country = models.CharField(max_length=255, blank=True, null=True, verbose_name='Country')
    region = models.CharField(max_length=255, blank=True, null=True, verbose_name='Region')
    city = models.CharField(max_length=255, blank=True, null=True, verbose_name='City')

    google_link = models.URLField(blank=True, null=True, verbose_name='Google link')
    telegram_link = models.URLField(blank=True, null=True, verbose_name='Telegram link')
    github_link = models.URLField(blank=True, null=True, verbose_name='GitHub link')
    head_hunter_link = models.URLField(blank=True, null=True, verbose_name='HeadHunter link')
    habr_link = models.URLField(blank=True, null=True, verbose_name='Habr link')

    def __str__(self):
        return f'Additional info of {self.user.get_username()}'


class UserSettings(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    language = models.CharField(max_length=10, default="en", verbose_name="language")
    theme = models.CharField(max_length=10, default="dark", verbose_name="theme")

    def __str__(self):
        return f"{self.user.username}`s settings"


class Post(models.Model):
    user_id = models.IntegerField(default=0)
    comments_id = models.IntegerField(default=0)
    title = models.TextField()
    content = models.TextField()
    time_published = models.DateTimeField(auto_now_add=True)
    difficult = models.IntegerField(default=0)
    views_count = models.IntegerField(default=0)
    bookmarks_count = models.IntegerField(default=0)


class ConfirmationCode(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    confirmation_code = models.CharField(max_length=6)
    expired = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.confirmation_code}"
