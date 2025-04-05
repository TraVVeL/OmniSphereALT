from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.utils.translation import gettext as _

from users.providers import GoogleAuthProvider, GithubAuthProvider, TelegramAuthProvider
from users.models import ExtendedUser, SocialAuth
from users.oauth_services import SocialAuthService, UserService
from .models import AdditionalUserInfo, Location, SocialLinks

User = get_user_model()


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['country', 'region', 'city']


class AdditionalUserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdditionalUserInfo
        fields = (
            'bio', 'specialty', 'gender', 'age', 'phone_number', 'location'
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
        model = SocialLinks
        fields = ['google_link', 'github_link', 'telegram_link', 'habr_link', 'head_hunter_link']


class PublicProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdditionalUserInfo
        fields = ['bio', 'age', 'specialty', 'location', 'gender', 'social_links', ]


class PublicUserProfileSerializer(serializers.ModelSerializer):
    profile = PublicProfileSerializer(read_only=True)

    class Meta:
        model = ExtendedUser
        fields = ['username', 'first_name', 'last_name', 'profile', 'profile_picture']


class LinkedAccountSerializer(serializers.ModelSerializer):
    connected_services = serializers.SerializerMethodField()

    class Meta:
        model = SocialAuth
        fields = ['connected_services']

    def get_connected_services(self, obj):
        services = obj.get_social_fields()
        return {
            service: bool(getattr(obj, service, None))
            for service in services
        }


class LinkAccountSerializer(serializers.Serializer):
    service = serializers.CharField()

    PROVIDER_MAPPING = {
        'google': GoogleAuthProvider,
        'github': GithubAuthProvider,
        'telegram': TelegramAuthProvider
    }

    def validate_service(self, value):
        valid_services = SocialAuth.get_social_fields()
        if value not in valid_services:
            raise serializers.ValidationError(
                f"{_('Unsupported service. Valid oauth_services')}: {', '.join(valid_services)}"
            )
        return value

    def get_provider(self):
        provider_class = self.PROVIDER_MAPPING.get(self.validated_data['service'])
        if not provider_class:
            raise serializers.ValidationError(_("Provider not found"))
        return provider_class()

    def save(self, **kwargs):
        user = self.context['request'].user
        request_data = self.context['request'].data

        provider = self.get_provider()
        user_info = provider.get_user_info(request_data)

        external_id = user_info.get('external_id')
        if not external_id:
            raise serializers.ValidationError({"external_id": _("External ID not provided")})

        SocialAuthService.get_or_create_social_auth(
            user=user,
            external_id=external_id,
            provider_field=self.validated_data['service']
        )

        for attr, value in user_info.get('defaults', {}).items():
            if value and hasattr(user, attr) and not getattr(user, attr):
                setattr(user, attr, value)

        profile_pic_url = user_info.get('profile_picture_url') or user_info.get('picture')
        if profile_pic_url and not user.profile_picture:
            UserService.download_and_save_image(user, profile_pic_url)

        user.save()


class UnlinkAccountSerializer(serializers.Serializer):
    service = serializers.ChoiceField(choices=SocialAuth.get_social_fields())

    def validate(self, data):
        service_name = data['service']
        social_auth = self.context['request'].user.social_auth

        if not getattr(social_auth, service_name, None):
            raise serializers.ValidationError(
                f"Service {service_name.capitalize()} is not connected"
            )
        return data
