from rest_framework import serializers
from .models import CommunityPost, CommunityComment

class CommunityPostSerializer(serializers.ModelSerializer):
    interest_count = serializers.SerializerMethodField()
    is_interested = serializers.SerializerMethodField()

    class Meta:
        model = CommunityPost
        fields = '__all__'

    def get_interest_count(self, obj):
        return obj.interests.count()

    def get_is_interested(self, obj):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if user and user.is_authenticated:
            return obj.interests.filter(user=user).exists()
        return False

class CommunityCommentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    post = serializers.PrimaryKeyRelatedField(queryset=CommunityPost.objects.all())
    
    class Meta:
        model = CommunityComment
        fields = ['id', 'post', 'user', 'content', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']

    def get_user(self, obj):
        return {
            'id': obj.user.id,
            'username': obj.user.username,
            'first_name': obj.user.first_name,
            'last_name': obj.user.last_name,
            'profile_picture': obj.user.profile_picture.url if obj.user.profile_picture else None
        }

    def validate_content(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Comment content cannot be empty")
        if len(value.strip()) > 1000:  # Maximum length of 1000 characters
            raise serializers.ValidationError("Comment content cannot exceed 1000 characters")
        return value.strip() 