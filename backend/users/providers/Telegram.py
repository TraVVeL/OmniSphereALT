from .base import SocialAuthProvider
from ..exeptions import TokenError, MissingDataError


class TelegramAuthProvider(SocialAuthProvider):
    """Provider to retrieve access token and return provided data"""
    def get_user_info(self, data):
        auth_data = data.get('auth_data')
        if not auth_data:
            raise TokenError("Telegram authorization data not provided")

        if not auth_data.get('id'):
            raise MissingDataError("User ID is missing from Telegram's data")

        return {
            'external_id': auth_data['id'],
            'defaults': {
                'username': auth_data.get('username', ''),
                'first_name': auth_data.get('first_name', ''),
            },
            'profile_picture_url': auth_data.get('photo_url', '')
        }
