from django.urls import path

from .views.update_profile import UpdateAccountView, GetProfileByUsernameView, PublicProfileView, ChangePasswordView, \
    SocialLinkView
from users.views.services import LinkedAccountView, LinkAccountView, UnlinkAccountView

urlpatterns = [
    # User profile's API to retrieve data and update it
    path('account/profile/', UpdateAccountView.as_view(), name='profile_edit'),
    path('account/profile/user/<str:username>/', GetProfileByUsernameView.as_view(), name='get_profile_by_username'),
    path('account/profile/public/<str:username>/', PublicProfileView.as_view(), name='public_profile'),
    path('account/change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('account/social-links/', SocialLinkView.as_view(), name='social_links'),
    path('account/linked-account/', LinkedAccountView.as_view(), name='connect_github'),
    path('account/link-account/', LinkAccountView.as_view(), name='link_account'),
    path('account/unlink-account/', UnlinkAccountView.as_view(), name='unlink_account'),

]
