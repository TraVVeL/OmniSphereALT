from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import ConfirmationCode


@shared_task
def delete_confirmation_code(user_id):
    try:
        confirmation_code = ConfirmationCode.objects.get(user_id=user_id, expired=False)
        if timezone.now() - confirmation_code.created_at > timedelta(minutes=10):
            confirmation_code.expired = True
            confirmation_code.save()
    except ConfirmationCode.DoesNotExist:
        pass
