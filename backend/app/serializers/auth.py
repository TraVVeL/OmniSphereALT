from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.utils.translation import gettext as _

from ..models import ConfirmationCode

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
