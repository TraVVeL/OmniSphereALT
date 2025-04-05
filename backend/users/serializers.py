from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.utils.translation import gettext as _

from .providers import GoogleAuthProvider, GithubAuthProvider, TelegramAuthProvider
from .oauth_services import SocialAuthService, UserService
from .models import ConfirmationCode, SocialAuth
User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, max_length=128)

    class Meta:
        model = User
        fields = ('email', 'password')

    def validate(self, value):
        email = value.get("email")
        if not email:
            raise serializers.ValidationError({"email": _("This field is required.")})
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": _("Email is already in use.")})
        return value

    def create(self, validated_data):
        validated_data.setdefault('username', validated_data['email'])
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        """Verify email and password and authenticate user"""
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            raise serializers.ValidationError({"error": _("Both fields are required.")})

        user = authenticate(username=email, password=password)
        if not user:
            raise serializers.ValidationError({"error": _("Invalid email or password.")})

        data["user"] = user
        return data


class EmailCheckSerializer(serializers.Serializer):
    email = serializers.EmailField()


class UsernameCheckSerializer(serializers.Serializer):
    username = serializers.CharField()


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField()
    password = serializers.CharField(min_length=8, max_length=128, write_only=True)

    class Meta:
        fields = ("email", "code", "password")

    def validate(self, data):
        user = User.objects.filter(email=data["email"]).first()
        if not user:
            raise serializers.ValidationError({"error": _("User with this email does not exist.")})

        confirmation_code = ConfirmationCode.objects.filter(user=user).first()
        if not confirmation_code:
            raise serializers.ValidationError({"error": _("Confirmation code not found.")})

        if confirmation_code.expired:
            raise serializers.ValidationError({"error": _("The confirmation code has expired.")})

        if data["code"] != confirmation_code.confirmation_code:
            raise serializers.ValidationError({"error": _("Verification code does not match.")})

        if user.check_password(data["password"]):
            raise serializers.ValidationError({"error": _("New password cannot be the same as the old password.")})

        data["user"] = user
        return data

    def update(self, instance, validated_data):
        """Updates user password and delete applied code"""
        user = validated_data["user"]
        user.set_password(validated_data["password"])
        user.save()

        ConfirmationCode.objects.filter(user=user).delete()

        return user


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
