from rest_framework import status


class SocialAuthError(Exception):
    """Base class for social authentication errors"""

    def __init__(self, message, status_code=status.HTTP_400_BAD_REQUEST):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class TokenError(SocialAuthError):
    """Error of interaction with provider API"""
    pass


class ProviderAPIError(SocialAuthError):
    """Error of interaction with provider API"""
    pass


class MissingDataError(SocialAuthError):
    """Error of missing required data"""
    pass
