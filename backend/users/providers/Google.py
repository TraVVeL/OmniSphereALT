from django.conf import settings

from .base import SocialAuthProvider
from ..exeptions import TokenError, MissingDataError

user_link = settings.SOCIAL_ACCOUNT_GOOGLE_USER_INFO


class GoogleAuthProvider(SocialAuthProvider):
    """Provider to retrieve access token and return provided data"""

    def get_user_info(self, data):
        access_token = data.get('access_token')
        if not access_token:
            raise TokenError("Access token not provided")

        user_data = self._make_request(
            url=user_link,
            headers={'Authorization': f'Bearer {access_token}'}
        )
        if not user_data.get('sub'):
            raise MissingDataError("The user ID is missing from the provider's response")

        return {
            'external_id': user_data.get('sub'),
            'defaults': {
                'username': user_data.get('name'),
                'email': user_data.get('email'),
            },
            'picture': user_data.get('picture'),
        }
