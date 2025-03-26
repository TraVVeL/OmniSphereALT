from .BaseAuthSerice import BaseAuthService
import requests


class OAuth2AuthService(BaseAuthService):
    user_info_url = ""
    token_url = ""
    client_id = ""
    client_secret = ""

    def __init__(self, client_id, client_secret, user_info_url, token_url=None):
        self.client_id = client_id
        self.client_secret = client_secret
        self.user_info_url = user_info_url
        self.token_url = token_url

    def get_access_token(self, code):
        if not self.token_url:
            raise NotImplementedError("Token URL is not provided")

        token_response = requests.post(
            self.token_url,
            data={
                'client_id': self.client_id,
                'client_secret': self.client_secret,
                'code': code,
            },
            headers={'Accept': 'application/json'},
        )
        token_response.raise_for_status()

        token_data = token_response.json()
        return token_data.get('access_token')

    def get_user_data(self, access_token):
        user_data_response = requests.get(
            self.user_info_url,
            headers={'Authorization': f'Bearer {access_token}'},
        )
        user_data_response.raise_for_status()

        return user_data_response.json()
