from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model

User = get_user_model()


class LinkedAccountView(APIView):
    """View for getting the profile and checking linked services."""
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        profile_data = {
            "google_id": getattr(user, 'google_id', None),
            "github_id": getattr(user, 'github_id', None),
            "telegram_id": getattr(user, 'telegram_id', None),
        }

        connected_services = {service: bool(id) for service, id in profile_data.items()}

        return Response({
            "status": "success",
            "data": connected_services
        })
