from django.urls import path
from .views import CompanyPermissionCreateView, get_company_permission

urlpatterns = [
    path('request/', CompanyPermissionCreateView.as_view(), name='company-permission-request'),
    path('<int:company_id>/', get_company_permission, name='get-company-permission'),
]
