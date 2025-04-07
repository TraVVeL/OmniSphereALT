from django.core.files.base import ContentFile
from django.db import transaction
from urllib.parse import urlparse
import requests

from ..models import ExtendedUser


class UserService:
    @staticmethod
    @transaction.atomic
    def get_or_create_user(user_info):
        defaults = user_info.get('defaults', {})

        user, created = ExtendedUser.objects.get_or_create(
            email=defaults.get('email', ''),
            defaults=defaults
        )

        if not created:
            for attr, value in defaults.items():
                setattr(user, attr, value)
            user.save()

        return user

    @staticmethod
    def download_and_save_image(user, image_url):
        try:
            response = requests.get(image_url)
            response.raise_for_status()

            parsed_url = urlparse(image_url)
            filename = parsed_url.path.split('/')[-1]
            image_file = ContentFile(response.content)

            user.profile_picture.save(filename, image_file, save=True)
            return True
        except Exception as e:
            print(f"Failed to download image: {str(e)}")
            return False
