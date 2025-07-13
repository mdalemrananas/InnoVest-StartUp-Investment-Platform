from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.views import APIView
from .models import Company
from .serializers import CompanySerializer, CompanyPaymentSerializer
from backend.models import CompanyPayment
from django.db.models import Sum, Max
from django.conf import settings
import os
import logging
import json
import uuid
from datetime import datetime
from rest_framework.permissions import AllowAny

class FileUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        if 'image' not in request.FILES:
            return Response(
                {'error': 'No image file provided'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        upload_to = request.POST.get('upload_to', 'uploads')
        file_obj = request.FILES['image']
        
        # Generate a unique filename
        ext = os.path.splitext(file_obj.name)[1]
        filename = f"{uuid.uuid4().hex}{ext}"
        
        # Create the directory if it doesn't exist
        upload_dir = os.path.join(settings.MEDIA_ROOT, upload_to)
        os.makedirs(upload_dir, exist_ok=True)
        
        # Save the file
        file_path = os.path.join(upload_dir, filename)
        
        # Add logging to debug the file upload
        logger.info(f"Uploading file: {file_obj.name}")
        logger.info(f"Upload directory: {upload_dir}")
        logger.info(f"Full file path: {file_path}")
        logger.info(f"MEDIA_ROOT: {settings.MEDIA_ROOT}")
        
        with open(file_path, 'wb+') as destination:
            for chunk in file_obj.chunks():
                destination.write(chunk)
        
        # Verify file was created
        if os.path.exists(file_path):
            logger.info(f"File successfully saved: {file_path}")
            logger.info(f"File size: {os.path.getsize(file_path)} bytes")
        else:
            logger.error(f"File was not created: {file_path}")
        
        # Return the relative URL
        file_url = os.path.join(settings.MEDIA_URL, upload_to, filename)
        
        return Response({
            'status': 'success',
            'filename': filename,
            'url': file_url,
            'uploaded_at': datetime.now().isoformat()
        })

logger = logging.getLogger(__name__)

class CompanyListView(generics.ListAPIView):
    queryset = Company.objects.filter(company_status='Approved')
    serializer_class = CompanySerializer
    permission_classes = [permissions.AllowAny]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class CompanyPaymentViewSet(viewsets.ModelViewSet):
    queryset = CompanyPayment.objects.all()
    serializer_class = CompanyPaymentSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def verify_payment(self, request):
        try:
            payment_id = request.data.get('payment_id')
            if not payment_id:
                return Response({
                    'status': 'error',
                    'message': 'Payment ID is required'
                }, status=status.HTTP_400_BAD_REQUEST)

            payment = CompanyPayment.objects.filter(payment_id=payment_id).first()
            if not payment:
                return Response({
                    'status': 'error',
                    'message': 'Payment not found'
                }, status=status.HTTP_404_NOT_FOUND)

            # Update payment status to paid
            payment.payment_status = 'paid'
            payment.save()

            return Response({
                'status': 'success',
                'message': 'Payment verified successfully'
            })
        except Exception as e:
            logger.error(f"Error verifying payment: {str(e)}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.AllowAny]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_queryset(self):
        queryset = Company.objects.filter(company_status='Approved').order_by('-created_at')
        # Debug logging for companies and their fundraise terms
        for company in queryset:
            fundraise_terms = company.get_fundraise_terms()  # Use the method from Company model
            logger.debug(f"Company ID: {company.id}, Name: {company.product_name}")
            if fundraise_terms:
                logger.debug(f"Fundraise Terms found - Raise Amount: {fundraise_terms.raise_amount}, "
                           f"Valuation: {fundraise_terms.pre_money_valuation}, "
                           f"Max Investors: {fundraise_terms.max_investors}")
            else:
                logger.debug("No fundraise terms found for this company")
        return queryset

    def list(self, request):
        try:
            companies = self.get_queryset()
            logger.debug(f"Companies found: {companies.count()}")
            serializer = self.get_serializer(companies, many=True)
            serialized_data = serializer.data
            logger.debug(f"Serialized data: {json.dumps(serialized_data, indent=2)}")
            
            return Response({
                'status': 'success',
                'data': serialized_data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error in list view: {str(e)}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['GET'])
    def browse(self, request):
        """
        Endpoint for browsing companies with optional filters
        """
        try:
            queryset = self.get_queryset()
            
            # Apply filters if provided
            industry = request.query_params.get('industry', None)
            if industry:
                queryset = queryset.filter(industry=industry)
                
            location = request.query_params.get('location', None)
            if location:
                queryset = queryset.filter(city__icontains=location)
                
            status = request.query_params.get('status', None)
            if status:
                queryset = queryset.filter(company_status=status)

            serializer = self.get_serializer(queryset, many=True)
            serialized_data = serializer.data
            logger.debug(f"Browse serialized data: {json.dumps(serialized_data, indent=2)}")
            
            return Response({
                'status': 'success',
                'data': serialized_data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get'], url_path='total_payments')
    def total_payments(self, request, pk=None):
        try:
            company = self.get_object()
            logger.info(f"Getting total payments for company: {company.id} - {company.product_name}")
            
            payments = CompanyPayment.objects.filter(
                company=company,
                payment_status='paid'
            )
            logger.info(f"Found {payments.count()} paid payments")
            
            total = payments.aggregate(total=Sum('amount'))['total']
            logger.info(f"Total amount: {total}")
            
            return Response({
                'status': 'success',
                'total': float(total) if total else 0
            })
        except Company.DoesNotExist:
            logger.error(f"Company not found with ID: {pk}")
            return Response({
                'status': 'error',
                'message': 'Company not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error getting total payments: {str(e)}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get'], url_path='user_payments')
    def user_payments(self, request, pk=None):
        try:
            company = self.get_object()
            user = request.user
            
            if not user.is_authenticated:
                return Response({
                    'status': 'error',
                    'message': 'Authentication required'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            # Get all payments for this company (not just current user)
            payments = CompanyPayment.objects.filter(
                company=company
            ).select_related('user')  # Include user details in the query
            
            serializer = CompanyPaymentSerializer(payments, many=True)
            return Response(serializer.data)
            
        except Company.DoesNotExist:
            logger.error(f"Company not found with ID: {pk}")
            return Response({
                'status': 'error',
                'message': 'Company not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error getting user payments: {str(e)}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], url_path='recently-funded', permission_classes=[AllowAny])
    def recently_funded(self, request):
        """
        Returns companies ordered by their most recent paid payment date (latest first).
        """
        companies = Company.objects.annotate(
            latest_payment=Max('companypayment__payment_date')
        ).filter(
            companypayment__payment_status='paid',
            latest_payment__isnull=False
        ).order_by('-latest_payment').distinct()
        serializer = self.get_serializer(companies, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], url_path='paid_investors_count')
    def paid_investors_count(self, request, pk=None):
        try:
            company = self.get_object()
            # Count distinct users who have paid payments for this company
            paid_investors_count = CompanyPayment.objects.filter(
                company=company,
                payment_status='paid'
            ).values('user').distinct().count()
            return Response({
                'status': 'success',
                'count': paid_investors_count
            })
        except Company.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Company not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 