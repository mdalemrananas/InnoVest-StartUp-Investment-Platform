from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import CompanyEvent
from .serializers import CompanyEventSerializer
import logging

logger = logging.getLogger(__name__)

# Create your views here.

class CompanyEventViewSet(viewsets.ModelViewSet):
    queryset = CompanyEvent.objects.all()
    serializer_class = CompanyEventSerializer
    permission_classes = [IsAuthenticated]  # Require authentication for all operations
    
    def get_queryset(self):
        queryset = CompanyEvent.objects.all().order_by('-start_at')
        # Only filter by company_id if provided
        company_id = self.request.query_params.get('company', None)
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        return queryset
    
    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            logger.info(f"Successfully fetched all events")
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error in list view: {str(e)}")
            return Response(
                {"error": f"Failed to fetch events: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def create(self, request, *args, **kwargs):
        try:
            # Automatically set the user ID from the authenticated user
            mutable_data = request.data.copy()
            mutable_data['user'] = request.user.id
            request._full_data = mutable_data
            
            serializer = self.get_serializer(data=mutable_data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            
            logger.info(f"Successfully created event for user {request.user.id}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error creating event: {str(e)}")
            return Response(
                {"error": f"Failed to create event: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
