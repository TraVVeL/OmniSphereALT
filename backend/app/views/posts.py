from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..serializers import PostSerializer
from ..models import Post


# TODO: MAKE IT CLASSIFY
@api_view(['POST'])
def create_post(request):
    print(request.data)
    """Create a new post."""
    serializer = PostSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def list_posts(request):
    """List all posts."""
    posts = Post.objects.all()
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)
