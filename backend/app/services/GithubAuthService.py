from decouple import config
from django.contrib.auth import get_user_model

from .Oauth2AuthService import OAuth2AuthService

User = get_user_model()


class GithubAuthService(OAuth2AuthService):
    def __init__(self):
        super().__init__(
            client_id=config('SOCIAL_AUTH_GITHUB_KEY'),
            client_secret=config('SOCIAL_AUTH_GITHUB_SECRET'),
            user_info_url="https://api.github.com/user",
            token_url="https://github.com/login/oauth/access_token"
        )
        self.provider_name = 'github'
