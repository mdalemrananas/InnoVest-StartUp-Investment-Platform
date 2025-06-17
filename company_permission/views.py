from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import CompanyPermission
from .serializers import CompanyPermissionSerializer
import logging
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

logger = logging.getLogger(__name__)

# Create your views here.

class CompanyPermissionCreateView(generics.CreateAPIView):
    queryset = CompanyPermission.objects.all()
    serializer_class = CompanyPermissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            # Check if user already has a request for this company
            existing_request = CompanyPermission.objects.filter(
                user=request.user.id,
                company=request.data.get('company')
            ).first()

            if existing_request:
                return Response({
                    'status': 'error',
                    'message': 'You have already submitted a request for this company'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Log the incoming request data
            logger.info(f"Received permission request: {request.data}")
            logger.info(f"Authenticated user: {request.user.id}")
            
            # Create a mutable copy of the request data
            mutable_data = request.data.copy()
            
            # Set the user ID from the authenticated user
            mutable_data['user'] = request.user.id
            
            # Log the data we're about to validate
            logger.info(f"Data to be validated: {mutable_data}")
            
            # Validate the data
            serializer = self.get_serializer(data=mutable_data)
            if not serializer.is_valid():
                logger.error(f"Validation errors: {serializer.errors}")
                return Response({
                    'status': 'error',
                    'message': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Save the permission request
            self.perform_create(serializer)
            
            logger.info(f"Successfully created permission request for user {request.user.id}")
            return Response({
                'status': 'success',
                'message': 'Permission request submitted successfully',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error creating permission request: {str(e)}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_company_permission(request, company_id):
    try:
        perm = CompanyPermission.objects.get(user=request.user, company_id=company_id)
        return Response({'company_permission': perm.company_permission})
    except CompanyPermission.DoesNotExist:
        return Response({'company_permission': 'no'})
