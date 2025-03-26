from django.conf import settings
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.crypto import get_random_string
from django.utils.translation import gettext as _

from .tasks import delete_confirmation_code
from .models import ConfirmationCode


def send_confirmation_email(email, user):
    confirmation_code = get_random_string(length=6, allowed_chars="0123456789")
    subject = _("your_code_confirmation")

    html_message = render_to_string(
        template_name="confirmation_email.html",
        context={
            "welcome": _("welcome"),
            "username": user.username,
            "confirmation_code": confirmation_code,
            "text_to_user": _("text_code_is_valid_for_a_short_amount_time"),
            "rights_reserved": _("rights_reserved"),
        }
    )
    email_from = f'OmniSphere <{settings.EMAIL_HOST_USER}>'
    recipient_list = [email]
    email_message = EmailMessage(subject, html_message, email_from, recipient_list)
    email_message.content_subtype = 'html'
    email_message.send()

    ConfirmationCode.objects.update_or_create(
        user=user,
        defaults={
            "confirmation_code": confirmation_code,
            "created_at": timezone.now(),
            "expired": False,
        },
    )

    delete_confirmation_code.apply_async((user.id,), countdown=600)

    return confirmation_code
