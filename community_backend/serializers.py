from rest_framework import serializers
from .models import CommunityPost

class CommunityPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityPost
        fields = '__all__' 