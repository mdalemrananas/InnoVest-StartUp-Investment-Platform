from django import forms
from .models import ProgressUpdate

class ProgressUpdateForm(forms.ModelForm):
    class Meta:
        model = ProgressUpdate
        fields = ['update_title', 'description', 'percent_complete', 'expense_used', 'report_file', 'image']

