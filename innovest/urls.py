from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers
from backend.views import (
    CompanyBusinessPlanViewSet,
    CompanyFundraiseTermsViewSet,
    CompanyContactView,
    submit_kyc
)

router = routers.DefaultRouter()
router.register(r'business-plans', CompanyBusinessPlanViewSet, basename='business-plans')
router.register(r'fundraise-terms', CompanyFundraiseTermsViewSet, basename='fundraise-terms')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/payments/', include('payments.urls')),
    path('api/', include('companies.urls')),
    path('api/', include('events.urls')),
    path('api/auth/', include('authentication.urls')),
    path('api/', include('contact.urls')),
    path('api/contact/', CompanyContactView.as_view(), name='contact'),
    path('api-auth/', include('rest_framework.urls')),
    path('api/company-permission/', include('company_permission.urls')),
    path('api/emails/', include('emails.urls')),
    path('api/mailer/', include('mailer.urls')),
    path('api/company-control/', include('company_control.urls')),
    path('api/user-control/', include('user_control.urls')),
    path('api/settings/', include('settings.urls')),
    path('api/chat/', include('chat.urls')),
    path('api/kyc/submit/', submit_kyc, name='submit_kyc'),
    path('api/community/', include('community_backend.urls')),
    path('api/', include('my_companies.urls')),
    path('api/', include('my_companies_trackprogress.urls')),
    path('api/', include('my_companies_permission.urls')),
    path('api/ml/', include('ml_api.urls')),  # ML API endpoints
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)