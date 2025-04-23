from django.shortcuts import render, redirect
from .forms import CompanyForm

def company_info_view(request):
    if request.method == 'POST':
        form = CompanyForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('company_info')  # You can redirect anywhere you like
    else:
        form = CompanyForm()
    return render(request, 'frontend/index.html', {'form': form})
