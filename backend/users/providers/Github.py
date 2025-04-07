from decouple import config
from django.conf import settings

from .base import SocialAuthProvider
from ..exeptions import TokenError, MissingDataError

token_link = settings.SOCIAL_AUTH_GITHUB_USER_TOKEN
user_link = settings.SOCIAL_AUTH_GITHUB_USER_URL
email_link = settings.SOCIAL_AUTH_GITHUB_USER_EMAIL


class GithubAuthProvider(SocialAuthProvider):
    """Provider to retrieve access token and return provided data"""

    def get_user_info(self, data):
        code = data.get('code')
        if not code:
            raise TokenError("Github authorization code not provided")

        token_data = self._make_request(
            url=token_link,
            method='post',
            data={
                'client_id': config('SOCIAL_AUTH_GITHUB_KEY'),
                'client_secret': config('SOCIAL_AUTH_GITHUB_SECRET'),
                'code': code,
            },
            headers={'Accept': 'application/json'}
        )

        access_token = token_data.get('access_token')
        if not access_token:
            raise TokenError("Failed to get access token from Github")

        user_data = self._make_request(
            url=user_link,
            headers={'Authorization': f'Bearer {access_token}'}
        )

        if not user_data.get('id'):
            raise MissingDataError("The user ID is missing from the Github response")

        email_data = self._make_request(
            url=email_link,
            headers={'Authorization': f"Bearer {access_token}"}
        )

        primary_email = next((e['email'] for e in email_data if e['primary']), None)

        return {
            'external_id': user_data.get('id'),
            'defaults': {
                'username': user_data.get('login'),
                'email': primary_email or user_data.get('email'),
            },
            'profile_picture_url': user_data.get('avatar_url'),
        }
