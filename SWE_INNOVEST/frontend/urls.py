from django.urls import path
from .views import company_info_view

urlpatterns = [
    path('', company_info_view, name='company_info'),
]
