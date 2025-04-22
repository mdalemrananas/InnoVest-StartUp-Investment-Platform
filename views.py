from django.shortcuts import render

from django.shortcuts import render, redirect, get_object_or_404
from .models import Project, ProgressUpdate
from .forms import ProgressUpdateForm
from django.contrib.auth.decorators import login_required

@login_required
def track_progress(request):
    if request.user.groups.filter(name='Fundraiser').exists():
        projects = Project.objects.filter(fundraiser=request.user)
    elif request.user.groups.filter(name='Investor').exists():
        projects = request.user.invested_projects.all()
    else:
        projects = Project.objects.all()
    return render(request, 'progress/track_progress.html', {'projects': projects})

@login_required
def add_progress_update(request, project_id=None):
    if project_id:
        project = get_object_or_404(Project, id=project_id)
    else:
        project = None

    if request.method == 'POST':
        form = ProgressUpdateForm(request.POST, request.FILES)
        if form.is_valid():
            progress = form.save(commit=False)
            progress.project = project
            progress.save()
            return redirect('track_progress')
    else:
        form = ProgressUpdateForm()
    return render(request, 'progress/add_progress_update.html', {'form': form, 'project': project})

@login_required
def project_detail(request, project_id):
    project = get_object_or_404(Project, id=project_id)
    progress_updates = project.progress_updates.order_by('-created_at')
    return render(request, 'progress/project_detail.html', {
        'project': project,
        'updates': progress_updates
    })

