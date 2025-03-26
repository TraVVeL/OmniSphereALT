from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model

User = get_user_model()


class LinkAccountView(APIView):
    """View for linking external accounts to an existing user."""
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        service_name = request.data.get('service')
        user = request.user

        if not service_name:
            return Response({"error": "Service name required"}, status=status.HTTP_400_BAD_REQUEST)

        service_name = service_name.lower()
        if service_name not in ['google', 'github', 'telegram']:
            return Response({"error": "Unsupported service"}, status=status.HTTP_400_BAD_REQUEST)

        if service_name == 'google':
            from ..services.GoogleAuthService import GoogleAuthService
            service = GoogleAuthService()
        elif service_name == 'github':
            from ..services.GithubAuthService import GithubAuthService
            service = GithubAuthService()
        elif service_name == 'telegram':
            from ..services.TelegramAuthService import TelegramAuthService
            service = TelegramAuthService()

        try:
            if service_name == 'google':
                token = request.data.get('access_token')
                if not token:
                    raise AuthenticationFailed("Access token required")
                user_info = service.get_user_data(token)
                external_id = user_info['sub']
            elif service_name == 'github':
                code = request.data.get('code')
                if not code:
                    raise AuthenticationFailed("Code required")
                access_token = service.get_access_token(code)
                user_data = service.get_user_data(access_token)
                external_id = user_data['id']
            elif service_name == 'telegram':
                auth_data = request.data.get('auth_data')
                if not auth_data:
                    raise AuthenticationFailed("Auth data required")
                service.verify_telegram_data(auth_data)
                external_id = auth_data['id']

            existing_user = User.objects.filter(**{f"{service_name}_id": external_id}).first()
            if existing_user and existing_user.id != user.id:
                raise AuthenticationFailed(f"This {service_name} account is already linked to another user")

            setattr(user, f"{service_name}_id", external_id)
            user.save()

            return Response({"success": f"{service_name.capitalize()} account successfully linked"})

        except AuthenticationFailed as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
