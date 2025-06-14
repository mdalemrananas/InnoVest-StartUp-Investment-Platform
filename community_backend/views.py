from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import CommunityPost, CommunityComment
from .serializers import CommunityPostSerializer, CommunityCommentSerializer

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

class CommunityCommentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id=None, comment_id=None):
        if comment_id:
            # Get a specific comment
            comment = get_object_or_404(CommunityComment, id=comment_id)
            serializer = CommunityCommentSerializer(comment)
            return Response(serializer.data)
        elif post_id:
            # Get all comments for a specific post
            comments = CommunityComment.objects.filter(post_id=post_id)
            serializer = CommunityCommentSerializer(comments, many=True)
            return Response(serializer.data)
        else:
            # Get all comments
            comments = CommunityComment.objects.all()
            serializer = CommunityCommentSerializer(comments, many=True)
            return Response(serializer.data)

    def post(self, request, post_id):
        try:
            post = get_object_or_404(CommunityPost, id=post_id)
            print(f"Creating comment for post {post_id} by user {request.user.id}")
            print(f"Request data: {request.data}")
            
            # Add post_id to the request data
            data = request.data.copy()
            data['post'] = post_id
            
            serializer = CommunityCommentSerializer(data=data)
            if serializer.is_valid():
                comment = serializer.save(user=request.user, post=post)
                print(f"Comment created successfully: {comment.id}")
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                print(f"Serializer errors: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Error creating comment: {str(e)}")
            return Response(
                {"detail": f"Error creating comment: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request, comment_id):
        # Update a comment
        comment = get_object_or_404(CommunityComment, id=comment_id)
        if comment.user != request.user:
            return Response(
                {"detail": "You don't have permission to edit this comment."},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer = CommunityCommentSerializer(comment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, comment_id):
        # Delete a comment
        comment = get_object_or_404(CommunityComment, id=comment_id)
        if comment.user != request.user:
            return Response(
                {"detail": "You don't have permission to delete this comment."},
                status=status.HTTP_403_FORBIDDEN
            )
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
