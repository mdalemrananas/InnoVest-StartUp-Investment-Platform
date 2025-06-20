from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
import requests
from django.conf import settings
import logging

from .models import CommunityPost, CommunityComment, CommunityInterest
from .serializers import CommunityPostSerializer, CommunityCommentSerializer, NotificationSerializer

# Set up logging
logger = logging.getLogger(__name__)

# Create your views here.

class CommunityPostCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # To return all posts, use the next line. To return only the current user's posts, uncomment the filter line below.
        posts = CommunityPost.objects.all()
        # posts = CommunityPost.objects.filter(user=request.user)
        serializer = CommunityPostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)

    def get_object(self, pk):
        return get_object_or_404(CommunityPost, pk=pk)

    def patch(self, request, *args, **kwargs):
        post_id = kwargs.get('pk')
        post = self.get_object(post_id)
        serializer = CommunityPostSerializer(post, data=request.data, partial=True, context={'request': request})
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
        serializer = CommunityPostSerializer(data=request.data, context={'request': request})
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

    def _check_hate_speech(self, text):
        """
        Check if the given text contains hate speech using the ML API.
        Returns (is_hate_speech, confidence, message)
        """
        try:
            # Get the ML API URL from settings or use a default
            ml_api_url = getattr(settings, 'ML_API_URL', 'http://localhost:8000/api')
            url = f"{ml_api_url}/hate-speech/detect/"
            
            # Make request to ML API
            response = requests.post(
                url,
                json={"text": text},
                timeout=2  # 2 second timeout
            )
            
            if response.status_code == 200:
                result = response.json()
                prediction = result.get('result', {})
                is_hate = prediction.get('prediction') == 'hate_speech'
                confidence = prediction.get('confidence', 0)
                
                # Consider it hate speech only if confidence is above threshold
                confidence_threshold = getattr(settings, 'HATE_SPEECH_CONFIDENCE_THRESHOLD', 0.7)
                if is_hate and confidence >= confidence_threshold:
                    return True, confidence, "This comment appears to contain hate speech and was not posted."
                return False, confidence, None
            
            logger.warning(f"ML API returned status {response.status_code}: {response.text}")
            return False, 0, None
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Error calling ML API: {str(e)}")
            # If the ML API is down, we'll let the comment through but log the error
            return False, 0, None

    def post(self, request, post_id):
        try:
            post = get_object_or_404(CommunityPost, id=post_id)
            logger.info(f"Creating comment for post {post_id} by user {request.user.id}")
            
            # Get the comment text
            comment_text = request.data.get('content', '').strip()
            if not comment_text:
                return Response(
                    {"detail": "Comment text is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check for hate speech
            is_hate_speech, confidence, message = self._check_hate_speech(comment_text)
            
            if is_hate_speech:
                logger.warning(
                    f"Blocked hate speech comment from user {request.user.id} "
                    f"on post {post_id} (confidence: {confidence:.2f})"
                )
                return Response(
                    {"detail": message or "This comment violates our community guidelines."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Add post_id to the request data
            data = request.data.copy()
            data['post'] = post_id
            
            # Log that we're about to save the comment
            logger.debug(f"Saving comment for post {post_id} by user {request.user.id}")
            
            serializer = CommunityCommentSerializer(data=data)
            if serializer.is_valid():
                comment = serializer.save(user=request.user, post=post)
                logger.info(f"Comment {comment.id} created successfully for post {post_id}")
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                logger.warning(
                    f"Validation error creating comment for post {post_id} by user {request.user.id}: "
                    f"{serializer.errors}"
                )
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(
                f"Error creating comment for post {post_id} by user {request.user.id}: {str(e)}",
                exc_info=True
            )
            return Response(
                {"detail": "An error occurred while creating the comment. Please try again later."},
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_interest(request, post_id):
    try:
        post = get_object_or_404(CommunityPost, id=post_id)
        user = request.user
        
        # Check if interest already exists
        interest = CommunityInterest.objects.filter(user=user, post=post).first()
        
        if interest:
            # If interest exists, remove it
            interest.delete()
            is_interested = False
        else:
            # If interest doesn't exist, create it
            CommunityInterest.objects.create(user=user, post=post)
            is_interested = True
            
        # Get updated interest count
        interest_count = CommunityInterest.objects.filter(post=post).count()
        
        return Response({
            'is_interested': is_interested,
            'interest_count': interest_count
        })
        
    except CommunityPost.DoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error in toggle_interest: {str(e)}")  # Add logging
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def community_notifications(request):
    """
    GET: Fetch latest notifications (comments on my posts, interest in my event posts).
    POST: Mark notifications as read (by ids/type).
    Query params: offset, limit
    """
    user = request.user
    offset = int(request.GET.get('offset', 0))
    limit = int(request.GET.get('limit', 10))
    # Comments on my posts (not by me)
    comment_qs = CommunityComment.objects.filter(
        post__user=user
    ).exclude(user=user)
    # Interests in my event posts (not by me)
    interest_qs = CommunityInterest.objects.filter(
        post__user=user,
        post__type='Event'
    ).exclude(user=user)
    # Combine and sort by created_at desc
    notifications = list(comment_qs) + list(interest_qs)
    notifications.sort(key=lambda n: n.created_at, reverse=True)
    # Paginate
    notifications_page = notifications[offset:offset+limit]
    # Annotate type/message
    for n in notifications_page:
        if hasattr(n, 'content'):
            n.type = 'comment'
            n.message = 'commented on your post'
        else:
            n.type = 'interest'
            n.message = 'showed interest in your event'
    # Serialize
    serializer = NotificationSerializer(notifications_page, many=True)
    # Count unread
    unread_count = sum(1 for n in notifications if n.read == 'No')
    # Mark as read if GET and mark_read is True
    mark_read = request.GET.get('mark_read', '').lower()
    if request.method == 'GET' and mark_read in ['true', '1', 'yes']:
        # Update all unread comments
        comment_qs.filter(read='No').update(read='Yes')
        # Update all unread interests
        interest_qs.filter(read='No').update(read='Yes')
        # Reset unread count since all are now read
        unread_count = 0
    return Response({
        'results': serializer.data,
        'unread_count': unread_count,
        'has_more': offset+limit < len(notifications),
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_unread_notification_count(request):
    """
    GET: Fetch the unread notification count for the logged-in user.
    """
    user = request.user

    # Count unread comments
    unread_comments_count = CommunityComment.objects.filter(
        post__user=user,
        read='No'
    ).exclude(user=user).count()

    # Count unread interests
    unread_interests_count = CommunityInterest.objects.filter(
        post__user=user,
        post__type='Event',
        read='No'
    ).exclude(user=user).count()

    total_unread_count = unread_comments_count + unread_interests_count

    return Response({'count': total_unread_count})
