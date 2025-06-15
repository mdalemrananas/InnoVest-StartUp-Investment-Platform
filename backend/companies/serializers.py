from rest_framework import serializers
from .models import Company
from .models import CompanyPayment

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'description', 'industry', 'location', 
                 'privacy_status', 'logo', 'cover_image', 'created_at']

class CompanyPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyPayment
        fields = [
            'payment_id',
            'user',
            'company',
            'amount',
            'payment_method',
            'transaction_id',
            'payment_status',
            'payment_date'
        ]
        read_only_fields = ['payment_id', 'payment_date']

    def create(self, validated_data):
        # Set payment status to 'paid' when creating a new payment
        validated_data['payment_status'] = 'paid'
        return super().create(validated_data) 