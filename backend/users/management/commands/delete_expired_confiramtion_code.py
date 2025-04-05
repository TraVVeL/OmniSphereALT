from django.core.management.base import BaseCommand
from django.utils import timezone

from backend.users.models import ConfirmationCode


class Command(BaseCommand):
    help = 'Delete expired confirmation codes'

    def handle(self, *args, **kwargs):
        expiration_time = timezone.now() - timezone.timedelta(minutes=10)
        deleted_count, _ = ConfirmationCode.objects.filter(created_at__lt=expiration_time).delete()
        self.stdout.write(self.style.SUCCESS(f'Successfully deleted {deleted_count} expired confirmation codes'))
