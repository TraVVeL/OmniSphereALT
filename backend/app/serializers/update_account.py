from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.utils.translation import gettext as _

from ..models import ExtendedUser, AdditionalUserInfo

User = get_user_model()


class AdditionalUserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdditionalUserInfo
        fields = (
            'bio', 'specialty', 'gender', 'age',
            'phone_number', 'country', 'region', 'city'
        )


class UserProfileSerializer(serializers.ModelSerializer):
    profile = AdditionalUserInfoSerializer()

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'username', 'email', 'profile_picture', 'profile')

    def update(self, instance, validated_data):
        if 'email' in validated_data:
            email = validated_data['email']
            if User.objects.exclude(pk=instance.pk).filter(email=email).exists():
                raise serializers.ValidationError({"error": _("This email is already in use.")})

        profile_data = validated_data.pop('profile', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if profile_data:
            profile, _ = AdditionalUserInfo.objects.get_or_create(user=instance)
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()

        return instance


class PasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        user = self.context["request"].user

        if data["current_password"] == data["new_password"]:
            raise serializers.ValidationError({"error": _("New password cannot be the same as the old password.")})

        if not user.check_password(data["current_password"]):
            raise serializers.ValidationError({"error": _("Incorrect current password.")})

        return data

    def update(self, instance, validated_data):
        """Instance is the user object"""
        return instance


class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdditionalUserInfo
        fields = ['google_link', 'github_link', 'telegram_link', 'habr_link', 'head_hunter_link']


class PublicProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdditionalUserInfo
        fields = ['bio', 'age', 'specialty', 'country', 'region', 'city', 'gender',
                  'google_link', 'telegram_link', 'github_link', 'head_hunter_link', 'habr_link', ]


class PublicUserProfileSerializer(serializers.ModelSerializer):
    profile = PublicProfileSerializer(read_only=True)

    class Meta:
        model = ExtendedUser
        fields = ['username', 'first_name', 'last_name', 'profile', 'profile_picture']
