from rest_framework import serializers
from .models import ChatMessage, ChatRequest
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class ChatMessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
    file = serializers.FileField(required=False, allow_null=True)
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatMessage
        fields = ['id', 'sender', 'receiver', 'message', 'file', 'file_url', 'timestamp', 'is_read']
        read_only_fields = ['timestamp']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and hasattr(obj.file, 'url'):
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None

class ChatRequestSerializer(serializers.ModelSerializer):
    from_user = UserSerializer(read_only=True)
    to_user = UserSerializer(read_only=True)

    class Meta:
        model = ChatRequest
        fields = ['id', 'from_user', 'to_user', 'status', 'created_at', 'responded_at']
        read_only_fields = ['created_at', 'responded_at', 'from_user', 'to_user', 'status'] 