from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from .services import UnlinkAccountView, LinkAccountView, LinkedAccountView
from .views import (
    RegisterView, LoginView, CheckEmailView, CheckLoginView, GetCode, ResetPasswordConfirmView,
    Google, Telegram, Github,
    create_post, list_posts,
    UpdateAccountView, ChangePasswordView, SocialLinkView, GetProfileByUsernameView,
    PublicProfileView,
)

schema_view = get_schema_view(
    openapi.Info(
        title="OmniSphere API",
        default_version='v1',
        terms_of_service="https://www.google.com/policies/terms/",
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    # Refresh token
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Posts
    path('posts/create/', create_post, name='create_post'),
    path('posts/', list_posts, name='list_posts'),

    # Authentication form
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/check-email/', CheckEmailView.as_view(), name='check_email'),
    path('auth/check-username/', CheckLoginView.as_view(), name='check_username'),
    path('auth/get-code/', GetCode.as_view(), name='get_code'),
    path('auth/reset-confirm/', ResetPasswordConfirmView.as_view(), name='confirm_reset_password'),
    path('auth/google/', Google.as_view(), name='google_auth'),
    path('auth/telegram/', Telegram.as_view(), name='telegram_auth'),
    path('auth/github/', Github.as_view(), name='github_auth'),

    # User profile
    path('account/profile/', UpdateAccountView.as_view(), name='profile_edit'),
    path('account/profile/user/<str:username>/', GetProfileByUsernameView.as_view(), name='get_profile_by_username'),
    path('account/profile/public/<str:username>/', PublicProfileView.as_view(), name='public_profile'),
    path('account/change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('account/social-links/', SocialLinkView.as_view(), name='social_links'),
    path('account/linked-account/', LinkedAccountView.as_view(), name='connect_github'),
    path('account/link-account/', LinkAccountView.as_view(), name='link_account'),
    path('account/unlink-account/', UnlinkAccountView.as_view(), name='unlink_account'),

    # Swagger
    path('swagger.<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
