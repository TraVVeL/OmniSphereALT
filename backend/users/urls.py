from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views.views import RegisterView, CheckLoginView, LoginView, CheckEmailView, GetCode, ResetPasswordConfirmView
from .views.services import Google, Telegram, Github

urlpatterns = [
    # Refresh token
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Authentication user to his stage API
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/check-email/', CheckEmailView.as_view(), name='check_email'),
    path('auth/check-username/', CheckLoginView.as_view(), name='check_username'),
    path('auth/get-code/', GetCode.as_view(), name='get_code'),
    path('auth/reset-confirm/', ResetPasswordConfirmView.as_view(), name='confirm_reset_password'),
    path('auth/google/', Google.as_view(), name='google_auth'),
    path('auth/telegram/', Telegram.as_view(), name='telegram_auth'),
    path('auth/github/', Github.as_view(), name='github_auth'),
]
