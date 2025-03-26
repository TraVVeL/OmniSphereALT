from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken

from django.conf import settings


class TokenHandlerMixin:
    """Mixin for handling JWT token generation and response."""

    @staticmethod
    def generate_tokens_for_user(user):
        """Generate refresh and access tokens for a user."""
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'email': user.email,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'profile_picture': user.profile_picture.url if user.profile_picture else None,
        }

    def get_success_response(self, user, status_code=status.HTTP_200_OK):
        """Return a standard success response with tokens."""
        tokens = self.generate_tokens_for_user(user)

        if getattr(settings, 'SIMPLE_JWT', {}).get('ROTATE_REFRESH_TOKENS', False):
            tokens['refresh'] = str(RefreshToken.for_user(user))

        return Response(tokens, status=status_code)

    def get_error_response(self, errors, status_code=status.HTTP_400_BAD_REQUEST):
        """Return a standard error response."""
        return Response(errors, status=status_code)
