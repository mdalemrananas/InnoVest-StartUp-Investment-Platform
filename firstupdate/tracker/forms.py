from django import forms
from .models import ProjectUpdate

class ProjectUpdateForm(forms.ModelForm):
    class Meta:
        model = ProjectUpdate
        fields = [
            'project_title', 'description', 'start_date', 'expense_amount',
            'completion_percentage', 'expense_percentage', 'total_budget',
            'remaining_amount', 'time_remaining', 'attachment'
        ]
        widgets = {
            'start_date': forms.DateInput(attrs={'type': 'date', 'required': 'required'}),
            'time_remaining': forms.DateInput(attrs={'type': 'date', 'required': 'required'}),
            'completion_percentage': forms.NumberInput(attrs={
                'type': 'range',
                'min': '0',
                'max': '100',
                'class': 'form-range',
                'required': 'required'
            }),
            'expense_percentage': forms.NumberInput(attrs={
                'type': 'range',
                'min': '0',
                'max': '100',
                'class': 'form-range',
                'required': 'required'
            }),
            'description': forms.Textarea(attrs={
                'rows': '8',
                'class': 'form-control',
                'style': 'height: 150px;',
                'required': 'required'
            }),
            'total_budget': forms.NumberInput(attrs={
                'min': '1',
                'step': '1',
                'required': 'required'
            }),
            'expense_amount': forms.NumberInput(attrs={
                'min': '1',
                'step': '1',
                'required': 'required'
            }),
            'remaining_amount': forms.NumberInput(attrs={
                'min': '1',
                'step': '1',
                'required': 'required'
            }),
            'project_title': forms.TextInput(attrs={'required': 'required'}),
        }

    def __init__(self, *args, **kwargs):
        super(ProjectUpdateForm, self).__init__(*args, **kwargs)
        # Make all fields required except attachment
        for field in self.fields:
            if field != 'attachment':
                self.fields[field].required = True

    def clean_total_budget(self):
        total_budget = self.cleaned_data.get('total_budget')
        if total_budget <= 0:
            raise forms.ValidationError("Total Budget must be greater than 0")
        return total_budget

    def clean_expense_amount(self):
        expense_amount = self.cleaned_data.get('expense_amount')
        if expense_amount <= 0:
            raise forms.ValidationError("Expense Amount must be greater than 0")
        return expense_amount

    def clean_remaining_amount(self):
        remaining_amount = self.cleaned_data.get('remaining_amount')
        if remaining_amount <= 0:
            raise forms.ValidationError("Remaining Amount must be greater than 0")
        return remaining_amount

    def clean_completion_percentage(self):
        completion_percentage = self.cleaned_data.get('completion_percentage')
        if completion_percentage is None:
            raise forms.ValidationError("Please set the completion percentage")
        if completion_percentage < 0 or completion_percentage > 100:
            raise forms.ValidationError("Completion Percentage must be between 0 and 100")
        return completion_percentage

    def clean_expense_percentage(self):
        expense_percentage = self.cleaned_data.get('expense_percentage')
        if expense_percentage is None:
            raise forms.ValidationError("Please set the expense percentage")
        if expense_percentage < 0 or expense_percentage > 100:
            raise forms.ValidationError("Expense Percentage must be between 0 and 100")
        return expense_percentage 