from django.urls import path


from .views import create_post, list_posts


urlpatterns = [
    # API to view and create posts
    path('posts/create/', create_post, name='create_post'),
    path('posts/', list_posts, name='list_posts'),
]
