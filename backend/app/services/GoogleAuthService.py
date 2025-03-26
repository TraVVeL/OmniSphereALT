from decouple import config
from django.contrib.auth import get_user_model

from .Oauth2AuthService import OAuth2AuthService

User = get_user_model()


class GoogleAuthService(OAuth2AuthService):
    def __init__(self):
        super().__init__(
            client_id=config('SOCIAL_ACCOUNT_GOOGLE_CLIENT_ID'),
            client_secret=config('SOCIAL_ACCOUNT_GOOGLE_SECRET'),
            user_info_url="https://www.googleapis.com/oauth2/v3/userinfo"
        )
        self.provider_name = 'google'
