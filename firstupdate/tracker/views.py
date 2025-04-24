from django.shortcuts import render, redirect
from .forms import ProjectUpdateForm
from .models import ProjectUpdate
from django.contrib import messages
from django.db.models import Max

def home(request):
    # Get only the most recent project update
    latest_update = ProjectUpdate.objects.order_by('-created_at').first()
    return render(request, 'tracker/home.html', {'latest_update': latest_update})

def add_update(request):
    if request.method == 'POST':
        form = ProjectUpdateForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, 'Project update submitted successfully!')
            return redirect('home')
    else:
        form = ProjectUpdateForm()
    return render(request, 'tracker/add_update.html', {'form': form})
