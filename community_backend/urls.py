from django.urls import path
from .views import CommunityPostCreateView, CommunityCommentView, toggle_interest

urlpatterns = [
    path('posts/', CommunityPostCreateView.as_view(), name='communitypost-create'),
    path('posts/<int:pk>/', CommunityPostCreateView.as_view(), name='communitypost-detail'),
    path('comments/', CommunityCommentView.as_view(), name='communitycomment-list'),
    path('comments/<int:comment_id>/', CommunityCommentView.as_view(), name='communitycomment-detail'),
    path('posts/<int:post_id>/comments/', CommunityCommentView.as_view(), name='communitycomment-create'),
    path('posts/<int:post_id>/toggle-interest/', toggle_interest, name='toggle-interest'),
] 