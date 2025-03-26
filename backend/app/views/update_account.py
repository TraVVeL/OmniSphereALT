from django.shortcuts import get_object_or_404
from rest_framework import status, permissions, mixins, generics
from rest_framework.views import APIView
from django.utils.translation import gettext as _

from ..serializers import (
    UserProfileSerializer, PasswordSerializer, SocialLinkSerializer,
    PublicUserProfileSerializer,
)
from django.contrib.auth import get_user_model

from rest_framework.response import Response

User = get_user_model()


class UpdateAccountView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        user = request.user
        cleaned_data = {}

        for key, value in request.data.items():
            if isinstance(value, list):
                cleaned_data[key] = value[0] if value else None
            else:
                cleaned_data[key] = value

        profile_fields = {'bio', 'specialty', 'gender', 'age', 'phone_number', 'country', 'region', 'city'}
        profile_data = {key: cleaned_data.pop(key) for key in list(cleaned_data.keys()) if key in profile_fields}

        if profile_data:
            cleaned_data['profile'] = profile_data

        serializer = UserProfileSerializer(user, data=cleaned_data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": _("Your account has been updated!"),
                    "user": serializer.data,
                },
                status=200,
            )

        return Response({"errors": serializer.errors}, status=400)


class ChangePasswordView(generics.GenericAPIView):
    """Change user's password and return message."""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PasswordSerializer

    def get_object(self):
        """Return current user as the object to update."""
        return self.request.user

    def patch(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = self.get_object()
        user.set_password(serializer.validated_data["new_password"])
        user.save()

        return Response(data={"message": _("Your password has been changed successfully!")}, status=status.HTTP_200_OK)


class SocialLinkView(APIView):
    """API to handle user's social links"""
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        """Get user's profile OR create it if missing"""
        user_profile = getattr(self.request.user, 'profile', None)
        if not user_profile:
            # Импортируем модель Profile и создаем новый профиль для пользователя
            from ..models import AdditionalUserInfo
            user_profile = AdditionalUserInfo.objects.create(user=self.request.user)
        return user_profile

    def handle_not_found(self):
        """Return 404 if user's profile was not found"""
        raise Response({"error": _("User profile was not found")}, status=status.HTTP_404_NOT_FOUND)

    def get(self, request, *args, **kwargs):
        """Return user's social links"""
        serializer = SocialLinkSerializer(self.get_object())
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        """Update social user's links """
        serializer = SocialLinkSerializer(self.get_object(), data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PublicProfileView(APIView):

    def get(self, request, username, *args, **kwargs):
        user = get_object_or_404(User, username=username)
        serializer = PublicUserProfileSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetProfileByUsernameView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, username=None, *args, **kwargs):
        if username:
            if request.user.username != username:
                return Response(
                    {"error": _("You don't have permission to access this profile")},
                    status=status.HTTP_403_FORBIDDEN
                )

            user = get_object_or_404(User, username=username)
        else:
            user = request.user

        serializer = UserProfileSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
