from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import CommunityPost
from .serializers import CommunityPostSerializer

# Create your views here.

class CommunityPostCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # To return all posts, use the next line. To return only the current user's posts, uncomment the filter line below.
        posts = CommunityPost.objects.all()
        # posts = CommunityPost.objects.filter(user=request.user)
        serializer = CommunityPostSerializer(posts, many=True)
        return Response(serializer.data)

    def get_object(self, pk):
        return get_object_or_404(CommunityPost, pk=pk)

    def patch(self, request, *args, **kwargs):
        post_id = kwargs.get('pk')
        post = self.get_object(post_id)
        serializer = CommunityPostSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        post_id = kwargs.get('pk')
        post = self.get_object(post_id)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def post(self, request, *args, **kwargs):
        serializer = CommunityPostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
