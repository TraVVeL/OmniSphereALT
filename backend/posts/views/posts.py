from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from ..models import Post
from ..serializers import PostSerializer


# TODO: MAKE IT CLASSIFY
@api_view(['POST'])
def create_post(request):
    """Create a new post."""
    serializer = PostSerializer(data=request.data)

    if serializer.is_valid(raise_exception=True):
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def list_posts(request):
    """List all posts."""
    posts = Post.objects.all()
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)
