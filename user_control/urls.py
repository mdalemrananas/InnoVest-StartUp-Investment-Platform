from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet

app_name = 'user_control'

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
] 