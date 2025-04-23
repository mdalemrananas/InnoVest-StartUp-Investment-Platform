from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    # Authentication
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/', views.profile_view, name='profile'),
    path('verify-email/<uuid:token>/', views.verify_email, name='verify_email'),

    # Projects
    path('', views.home_view, name='home'),
    path('projects/create/', views.create_project, name='create_project'),
    path('projects/<int:project_id>/', views.project_detail, name='project_detail'),
    path('projects/<int:project_id>/update/', views.create_update, name='create_update'),
    path('search/', views.search_projects, name='search_projects'),
    path('project/<int:project_id>/request-access/', views.request_access, name='request_access'),

    # Admin Dashboard
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('admin-companies/', views.admin_companies, name='admin_companies'),
    path('admin-crowdfunding/', views.admin_crowdfunding, name='admin_crowdfunding'),
    path('admin-contributors/', views.admin_contributors, name='admin_contributors'),
    path('company/<int:company_id>/', views.company_detail, name='company_detail'),
    path('update-company-status/', views.update_company_status, name='update_company_status'),
]