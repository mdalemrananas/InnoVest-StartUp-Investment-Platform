from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanyControlViewSet

router = DefaultRouter()
router.register(r'companies', CompanyControlViewSet, basename='company-control')

urlpatterns = [
    path('', include(router.urls)),
] 