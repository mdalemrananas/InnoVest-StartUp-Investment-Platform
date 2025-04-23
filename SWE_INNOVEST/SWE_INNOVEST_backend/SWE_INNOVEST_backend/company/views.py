from django.shortcuts import render, redirect
from .forms import CompanyInfoForm
from django.contrib import messages

def company_info(request):
    if request.method == 'POST':
        form = CompanyInfoForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, 'Company information saved successfully!')
            return redirect('company:company_info')  # Redirect to a success page or stay on the same page
        else:
            messages.error(request, 'There was an error saving the company information.')
    else:
        form = CompanyInfoForm()
    
    return render(request, 'company/company_info.html', {'form': form})
