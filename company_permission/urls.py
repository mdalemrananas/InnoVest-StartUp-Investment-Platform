from django.urls import path
from .views import CompanyPermissionCreateView, get_company_permission, company_users_with_permission

urlpatterns = [
    path('request/', CompanyPermissionCreateView.as_view(), name='company-permission-request'),
    path('<int:company_id>/', get_company_permission, name='get-company-permission'),
    path('users/', company_users_with_permission, name='company-users-with-permission'),
]
