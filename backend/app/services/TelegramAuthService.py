import hashlib
import hmac
from django.contrib.auth import get_user_model
from decouple import config
from rest_framework.exceptions import AuthenticationFailed

from .BaseAuthSerice import BaseAuthService

User = get_user_model()


class TelegramAuthService(BaseAuthService):
    def __init__(self):
        self.telegram_bot_token = config('TELEGRAM_BOT_TOKEN')
        self.provider_name = 'telegram'

    def verify_telegram_data(self, auth_data):
        token = self.telegram_bot_token
        data_check_string = "\n".join(f"{k}={v}" for k, v in sorted(auth_data.items()) if k != 'hash')
        secret_key = hashlib.sha256(token.encode()).digest()
        hash_check = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
        if hash_check != auth_data['hash']:
            raise AuthenticationFailed("Hash mismatch")
        return auth_data
