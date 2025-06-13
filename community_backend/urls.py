from django.urls import path
from .views import CommunityPostCreateView

urlpatterns = [
    path('posts/', CommunityPostCreateView.as_view(), name='communitypost-create'),
] 