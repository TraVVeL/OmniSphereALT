from django.db import models


class Post(models.Model):
    # Realization is not implemented so it like using a plug
    user_id = models.IntegerField(default=0)
    comments_id = models.IntegerField(default=0)
    title = models.TextField()
    content = models.TextField()
    time_published = models.DateTimeField(auto_now_add=True)
    difficult = models.IntegerField(default=0)
    views_count = models.IntegerField(default=0)
    bookmarks_count = models.IntegerField(default=0)
