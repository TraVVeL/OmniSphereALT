from rest_framework import serializers
from ..models import Post


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = (
            'id',
            'user_id',
            'comments_id',
            'title', 'content',
            'time_published',
            'difficult',
            'views_count',
            'bookmarks_count',
        )
