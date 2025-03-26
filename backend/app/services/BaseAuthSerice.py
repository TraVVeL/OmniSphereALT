from django.core.files import File
from django.core.files.temp import NamedTemporaryFile
import requests
from oauthlib.oauth2 import OAuth2Error


class BaseAuthService:
    provider_name = ""

    def download_profile_picture(self, url):
        response = requests.get(url)
        response.raise_for_status()
        img_temp = NamedTemporaryFile()
        img_temp.write(response.content)
        img_temp.flush()
        return File(img_temp)

    def get_or_create_user(self, model, external_id, defaults, profile_picture_url=None):
        user, created = model.objects.get_or_create(
            **{f"{self.provider_name}_id": external_id},
            defaults=defaults
        )

        if created and profile_picture_url:
            profile_picture_file = self.download_profile_picture(profile_picture_url)
            user.profile_picture.save(f"{user.username}_profile.jpg", profile_picture_file, save=True)
        return user, created

    def handle_authentication_exception(self, exception, default_message="Authentication failed"):
        if isinstance(exception, OAuth2Error):
            return {"error": str(exception)}, 400
        return {"error": default_message}, 500
