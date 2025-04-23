from django import forms
from .models import CompanyInfo

class CompanyInfoForm(forms.ModelForm):
    class Meta:
        model = CompanyInfo
        fields = ['company_name', 'quick_description', 'industry', 'country', 'state', 'city', 'company_image']
