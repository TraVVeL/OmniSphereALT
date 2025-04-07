from django.db import transaction

from ..models import SocialAuth
from ..exeptions import SocialAuthError


class SocialAuthService:
    @staticmethod
    @transaction.atomic
    def get_or_create_social_auth(user, external_id, provider_field):
        filter_kwargs = {provider_field: external_id}
        existing_auth = SocialAuth.objects.filter(**filter_kwargs).first()

        if existing_auth:
            if existing_auth.user != user:
                raise SocialAuthError(f"This {provider_field} account is already linked to another user")
            return existing_auth

        try:
            social_auth = SocialAuth.objects.get(user=user)
            setattr(social_auth, provider_field, external_id)
            social_auth.save()
        except SocialAuth.DoesNotExist:
            kwargs = {'user': user, provider_field: external_id}
            social_auth = SocialAuth.objects.create(**kwargs)

        return social_auth

    @staticmethod
    def get_user_by_social_auth(external_id, provider_field):
        """Получение пользователя по external_id и provider_field"""
        filter_kwargs = {provider_field: external_id}
        social_auth = SocialAuth.objects.filter(**filter_kwargs).first()
        return social_auth.user if social_auth else None
