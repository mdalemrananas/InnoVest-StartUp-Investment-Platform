from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import ChatMessage
from .serializers import ChatMessageSerializer, UserSerializer
from django.db import models
import logging
from django.db.models import Q

logger = logging.getLogger(__name__)
User = get_user_model()

class ChatMessageViewSet(viewsets.ModelViewSet):
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ChatMessage.objects.filter(
            Q(sender=self.request.user) | Q(receiver=self.request.user)
        ).order_by('timestamp')

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

    @action(detail=False, methods=['get'])
    def users(self, request):
        try:
            logger.info(f"Fetching users for {request.user.email}")
            users = User.objects.exclude(id=request.user.id)
            logger.info(f"Found {users.count()} users")
            
            # Log first few users for debugging
            for user in users[:3]:
                logger.debug(f"User: {user.email}, Name: {user.first_name} {user.last_name}")
            
            return Response([{
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'title': user.title if hasattr(user, 'title') else None
            } for user in users])
        except Exception as e:
            logger.error(f"Error in users endpoint: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'])
    def conversation(self, request):
        try:
            user_id = request.query_params.get('user_id')
            logger.info(f"Fetching conversation between {request.user.email} and user {user_id}")
            
            # Ensure user_id is provided
            if not user_id:
                return Response(
                    {'error': 'User ID is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get the other user
            try:
                other_user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response(
                    {'error': 'User not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Get messages where current user is either sender or receiver
            # and the other user is the selected user
            messages = ChatMessage.objects.filter(
                (Q(sender=request.user, receiver=other_user) |
                 Q(sender=other_user, receiver=request.user))
            ).order_by('timestamp')
            
            logger.info(f"Found {messages.count()} messages between {request.user.email} and {other_user.email}")
            
            # Mark unread messages as read
            unread_messages = messages.filter(
                receiver=request.user,
                is_read=False
            )
            if unread_messages.exists():
                unread_messages.update(is_read=True)
                logger.info(f"Marked {unread_messages.count()} messages as read")
            
            serializer = self.get_serializer(messages, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error in conversation endpoint: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'])
    def send(self, request):
        try:
            logger.info(f"User {request.user.email} sending message to {request.data.get('receiver')}")
            message = request.data.get('message')
            receiver_id = request.data.get('receiver')
            
            if not message or not receiver_id:
                return Response(
                    {'error': 'Message and receiver are required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            chat_message = ChatMessage.objects.create(
                sender=request.user,
                receiver_id=receiver_id,
                message=message
            )
            
            logger.info(f"Message created with ID: {chat_message.id}")
            serializer = self.get_serializer(chat_message)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error in send endpoint: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        try:
            logger.info(f"Marking message {pk} as read")
            message = self.get_object()
            if message.receiver == request.user:
                message.is_read = True
                message.save()
                logger.info(f"Message {pk} marked as read")
                return Response({'status': 'success'})
            return Response(
                {'error': 'Not authorized'},
                status=status.HTTP_403_FORBIDDEN
            )
        except Exception as e:
            logger.error(f"Error in mark_as_read endpoint: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
