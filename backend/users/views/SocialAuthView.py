from rest_framework import generics, status

from ..mixins import TokenHandlerMixin
from ..exeptions import SocialAuthError
from ..oauth_services import UserService, SocialAuthService


class SocialAuthView(generics.GenericAPIView, TokenHandlerMixin):
    """Base class for social authentication"""
    provider_class = None
    social_auth_field = None

    def get_provider(self):
        if not self.provider_class:
            raise ValueError("Provider class must be specified")
        return self.provider_class()

    def get_social_auth_field(self):
        if not self.social_auth_field:
            raise ValueError("Social users field must be specified")
        return self.social_auth_field

    def handle_auth_request(self, data):
        try:
            provider = self.get_provider()
            user_info = provider.get_user_info(data)

            external_id = user_info['external_id']
            provider_field = self.get_social_auth_field()

            user = SocialAuthService.get_user_by_social_auth(external_id, provider_field)

            if not user:
                user = UserService.get_or_create_user(user_info)

                profile_picture_url = user_info.get('profile_picture_url') or user_info.get('picture')
                if profile_picture_url and not user.profile_picture:
                    UserService.download_and_save_image(user, profile_picture_url)

                SocialAuthService.get_or_create_social_auth(
                    user=user,
                    external_id=external_id,
                    provider_field=provider_field
                )

            return self.get_success_response(user)

        except SocialAuthError as e:
            return self.get_error_response({"error": str(e)}, e.status_code)
        except Exception as e:
            return self.get_error_response(
                errors={"error": f"Internal server error: {str(e)}"},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request):
        return self.handle_auth_request(request.data)

    def get(self, request):
        return self.handle_auth_request(request.GET)
