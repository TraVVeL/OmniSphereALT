from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model

User = get_user_model()


class UnlinkAccountView(APIView):
    """View for unlinking external accounts from an existing user."""
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        service_name = request.data.get('service')
        user = request.user

        if not service_name:
            return Response({"error": "Service name required"}, status=status.HTTP_400_BAD_REQUEST)

        service_name = service_name.lower()
        if service_name not in ['google', 'github', 'telegram']:
            return Response({"error": "Unsupported service"}, status=status.HTTP_400_BAD_REQUEST)

        if not getattr(user, f"{service_name}_id", None):
            return Response({"error": f"No {service_name} account connected"}, status=status.HTTP_400_BAD_REQUEST)

        setattr(user, f"{service_name}_id", None)
        user.save()

        return Response({
            "success": f"{service_name.capitalize()} account successfully disconnected"
        })
