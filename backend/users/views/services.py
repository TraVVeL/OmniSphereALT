from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.utils.translation import gettext as _
from rest_framework.response import Response

from .SocialAuthView import SocialAuthView
from ..serializers import LinkAccountSerializer, UnlinkAccountSerializer, LinkedAccountSerializer
from ..providers import TelegramAuthProvider, GithubAuthProvider, GoogleAuthProvider

from ..models import SocialAuth


class Google(SocialAuthView):
    provider_class = GoogleAuthProvider
    social_auth_field = 'google'


class Telegram(SocialAuthView):
    provider_class = TelegramAuthProvider
    social_auth_field = 'telegram'


class Github(SocialAuthView):
    provider_class = GithubAuthProvider
    social_auth_field = 'github'


class LinkAccountView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        serializer = LinkAccountSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"success": _("Account successfully linked")}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UnlinkAccountView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        serializer = UnlinkAccountSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response(
                data={"error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        service_name = serializer.validated_data['service']
        setattr(request.user.social_auth, service_name, None)
        request.user.social_auth.save()

        return Response(
            {"status": "success", "message": f"{service_name.capitalize()} account successfully disconnected"})


class LinkedAccountView(APIView):
    """View for getting the profile and checking linked oauth_services."""
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        try:
            social_auth, _ = SocialAuth.objects.get_or_create(user=request.user)
            serializer = LinkedAccountSerializer(social_auth)
            return Response({"status": "success", "data": serializer.data})
        except Exception as e:
            return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
