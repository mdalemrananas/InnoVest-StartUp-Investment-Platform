from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from companies.models import Company
from .serializers import CompanyControlSerializer
import logging
import traceback

logger = logging.getLogger(__name__)

class CompanyControlViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanyControlSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            queryset = Company.objects.all()
            logger.info(f"Initial queryset count: {queryset.count()}")
            
            # Apply filters
            industry = self.request.query_params.get('industry', None)
            if industry:
                queryset = queryset.filter(industry=industry)
                logger.info(f"After industry filter: {queryset.count()}")
                
            status = self.request.query_params.get('status', None)
            if status:
                queryset = queryset.filter(company_status=status)
                logger.info(f"After status filter: {queryset.count()}")

            return queryset
        except Exception as e:
            logger.error(f"Error in get_queryset: {str(e)}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            return Company.objects.none()

    def list(self, request, *args, **kwargs):
        try:
            logger.info("Starting list view")
            logger.info(f"User: {request.user}")
            logger.info(f"Auth header: {request.headers.get('Authorization')}")
            
            companies = self.get_queryset()
            logger.info(f"Companies count: {companies.count()}")
            
            serializer = self.get_serializer(companies, many=True)
            logger.info("Serialization successful")
            
            return Response({
                'status': 'success',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error in list view: {str(e)}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        try:
            company = self.get_object()
            new_status = request.data.get('status')
            
            if not new_status:
                return Response({
                    'status': 'error',
                    'message': 'Status is required'
                }, status=status.HTTP_400_BAD_REQUEST)

            company.company_status = new_status
            company.save()

            serializer = self.get_serializer(company)
            return Response({
                'status': 'success',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error updating company status: {str(e)}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request, *args, **kwargs):
        try:
            request.data['user'] = request.user.id
            return super().create(request, *args, **kwargs)
        except Exception as e:
            logger.error(f"Error in create view: {str(e)}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except Exception as e:
            logger.error(f"Error in update view: {str(e)}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST) 