from django.urls import path
from . import views

urlpatterns = [
    path('track/', views.track_progress, name='track_progress'),
    path('add/', views.add_progress_update, name='add_progress_update'),
    path('project/<int:project_id>/', views.project_detail, name='project_detail'),
    path('project/<int:project_id>/add/', views.add_progress_update, name='add_progress_update_for_project'),
]
