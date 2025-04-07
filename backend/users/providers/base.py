from abc import ABC, abstractmethod
import requests

from ..exeptions import ProviderAPIError


class SocialAuthProvider(ABC):
    """Abstract class for social authentication providers"""

    @abstractmethod
    def get_user_info(self, data):
        """Retrieving user information from the provider"""
        pass

    @staticmethod
    def _make_request(url, method='get', headers=None, data=None, params=None):
        """A generic method for performing HTTP requests with error handling"""
        try:
            if method.lower() == 'get':
                response = requests.get(url, headers=headers, params=params)
            elif method.lower() == 'post':
                response = requests.post(url, headers=headers, data=data)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")

            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
            status_code = e.response.status_code
            raise ProviderAPIError(f"Provider API error: {e}", status_code=status_code)
        except requests.exceptions.ConnectionError as e:
            raise ProviderAPIError(f"Failed to connect to the provider: {e}")
        except requests.exceptions.Timeout as e:
            raise ProviderAPIError(f"Provider connection timeout: {e}")
        except requests.exceptions.RequestException as e:
            raise ProviderAPIError(f"Provider request error: {e}")
        except ValueError as e:
            raise ProviderAPIError(f"Incorrect response from the provider: {e}")
