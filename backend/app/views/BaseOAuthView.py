from abc import abstractmethod, ABC
from django.contrib.auth import get_user_model
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.views import APIView
from rest_framework import status
from .TokenHandlerMixin import TokenHandlerMixin

User = get_user_model()


class BaseOAuthView(TokenHandlerMixin, APIView, ABC):
    """Abstract base class for authentication views."""

    service_class = None

    def __init__(self, **kwargs):
        if not self.service_class:
            raise NotImplementedError("service_class must be implemented in child class.")
        super().__init__(**kwargs)
        self.service = self.service_class()

    @abstractmethod
    def get_user_data(self, request):
        """Extract user data from request."""
        pass

    def handle_request(self, request):
        try:
            user_data = self.get_user_data(request)
            email = user_data['defaults'].get('email')
            external_id = user_data['external_id']
            service_name = self.service_class.__name__.replace("AuthService", "").lower()

            user = User.objects.filter(email=email).first()

            if user:
                if getattr(user, f"{service_name}_id"):
                    if getattr(user, f"{service_name}_id") != external_id:
                        raise AuthenticationFailed(f"Account already linked to another {service_name} ID.")
                else:
                    setattr(user, f"{service_name}_id", external_id)
                    user.save()
            else:
                user_data['defaults']['username'] = self.get_unique_username(user_data['defaults']['username'])
                user, created = self.service.get_or_create_user(
                    User,
                    external_id=external_id,
                    defaults=user_data['defaults'],
                    profile_picture_url=user_data['profile_picture_url']
                )

            return self.get_success_response(user)

        except AuthenticationFailed as e:
            return self.get_error_response({"error": str(e)}, status_code=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return self.get_error_response({"error": str(e)}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request):
        return self.handle_request(request)

    def post(self, request):
        return self.handle_request(request)

    @staticmethod
    def get_unique_username(base_username):
        """Generate a unique username by appending a random string."""
        existing_count = User.objects.filter(username__startswith=base_username).count()
        return f"{base_username}{existing_count}" if existing_count > 0 else base_username
