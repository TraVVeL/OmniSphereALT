from django.contrib.auth import get_user_model
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework import status, generics, mixins
from django.utils.translation import gettext as _

from .BaseOAuthView import BaseOAuthView
from .TokenHandlerMixin import TokenHandlerMixin
from ..services import GoogleAuthService, TelegramAuthService, GithubAuthService
from ..serializers import (
    RegisterSerializer, LoginSerializer, ResetPasswordSerializer, EmailCheckSerializer, UsernameCheckSerializer
)
from ..email_confirmation import send_confirmation_email

User = get_user_model()


class RegisterView(TokenHandlerMixin, generics.CreateAPIView):
    """Handles creating a new user and returning JWT tokens"""

    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        """Create user and return JWT-Tokens"""
        user = serializer.save()
        self.user = user

    def create(self, request, *args, **kwargs):
        """Override create() to add Tokens to response"""
        response = super().create(request, *args, **kwargs)
        return self.get_success_response(self.user, status.HTTP_201_CREATED)


class LoginView(TokenHandlerMixin, mixins.CreateModelMixin, generics.GenericAPIView):
    """Handle user authentication and return JWT tokens"""

    serializer_class = LoginSerializer

    def perform_create(self, serializer):
        """Authenticate user and retrieve tokens"""
        self.user = serializer.validated_data["user"]

    def post(self, request, *args, **kwargs):
        """Override post() to add Tokens to response"""
        response = self.create(request, *args, **kwargs)
        return self.get_success_response(self.user, status.HTTP_200_OK)


class CheckEmailView(mixins.CreateModelMixin, generics.GenericAPIView):
    """Check if an email exists in the database"""

    serializer_class = EmailCheckSerializer

    def perform_create(self, serializer):
        """Check if an email exists in the database"""
        email = serializer.validated_data["email"]
        exists = User.objects.filter(email=email).exists()
        self.response_data = {"exists": exists}

    def post(self, request, *args, **kwargs):
        """Return Boolean result"""
        self.create(request, *args, **kwargs)
        return Response(self.response_data, status=status.HTTP_200_OK)


class CheckLoginView(mixins.CreateModelMixin, generics.GenericAPIView):
    """Check if a login exists in the database"""

    serializer_class = UsernameCheckSerializer

    def perform_create(self, serializer):
        """Check if a login exists in the database"""
        username = serializer.validated_data["username"]
        exists = User.objects.filter(username=username).exists()
        self.response_data = {"exists": exists}

    def post(self, request, *args, **kwargs):
        """Return Boolen result"""
        self.create(request, *args, **kwargs)
        return Response(self.response_data, status=status.HTTP_200_OK)


class GetCode(mixins.CreateModelMixin, generics.GenericAPIView):
    """Send a confirmation code to the user's email"""

    serializer_class = EmailCheckSerializer

    def perform_create(self, serializer):
        """Send verification code to the user's email"""
        email = serializer.validated_data["email"]

        try:
            user = User.objects.get(email=email)
            confirmation_code = send_confirmation_email(email, user)
            self.response_data = {
                "message": _("Confirmation code sent to your email"),
                "confirmation_code": confirmation_code,
            }
        except User.DoesNotExist:
            self.response_data = {"error": _("User with this email does not exist")}
            self.response_status = status.HTTP_400_BAD_REQUEST
        else:
            self.response_status = status.HTTP_200_OK

    def post(self, request, *args, **kwargs):
        """Process POST-query and send a code"""
        self.create(request, *args, **kwargs)
        return Response(self.response_data, status=self.response_status)


class ResetPasswordConfirmView(TokenHandlerMixin, mixins.CreateModelMixin, generics.GenericAPIView):
    """Reset user password and return new JWT tokens."""

    serializer_class = ResetPasswordSerializer

    def perform_create(self, serializer):
        """Updates user`s password"""
        self.user = serializer.update(None, serializer.validated_data)

    def post(self, request, *args, **kwargs):
        response = self.create(request, *args, **kwargs)
        return self.get_success_response(self.user)


class Google(BaseOAuthView):
    service_class = GoogleAuthService

    def get_user_data(self, request):
        token = request.data.get('access_token')
        if not token:
            raise AuthenticationFailed("Could not authenticate user.")

        user_info = self.service.get_user_data(token)

        return {
            'external_id': user_info['sub'],
            'defaults': {
                'email': user_info['email'],
                'username': user_info['name'],
                'first_name': user_info['given_name'],
            },
            'profile_picture_url': user_info['picture']
        }


class Telegram(BaseOAuthView):
    service_class = TelegramAuthService

    def get_user_data(self, request):
        auth_data = request.data.get('auth_data')
        if not auth_data:
            raise AuthenticationFailed("No auth data provided")

        self.service.verify_telegram_data(auth_data)
        return {
            'external_id': auth_data['id'],
            'defaults': {
                'username': auth_data.get('username', ''),
                'first_name': auth_data['first_name'],
            },
            'profile_picture_url': auth_data['photo_url']
        }


class Github(BaseOAuthView):
    service_class = GithubAuthService

    def get_user_data(self, request):
        code = request.GET.get('code')

        if not code:
            raise AuthenticationFailed("Code not provided!")

        access_token = self.service.get_access_token(code)
        user_data = self.service.get_user_data(access_token)

        return {
            'external_id': user_data['id'],
            'defaults': {
                'username': user_data['login']
            },
            'profile_picture_url': user_data['avatar_url']
        }
