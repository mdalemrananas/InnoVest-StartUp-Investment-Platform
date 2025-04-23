from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import CustomUser, Project, Investment, ProjectUpdate, Comment

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    
    class Meta:
        model = CustomUser
        fields = ('email', 'username', 'password1', 'password2', 'is_investor', 'is_entrepreneur')
    
    def save(self, commit=True):
        user = super(CustomUserCreationForm, self).save(commit=False)
        user.email = self.cleaned_data['email']
        if commit:
            user.save()
        return user

class CustomAuthenticationForm(AuthenticationForm):
    class Meta:
        model = CustomUser
        fields = ('email', 'password')

class UserProfileForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ('profile_picture', 'bio', 'location', 'phone_number')

class ProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = [
            'title', 'description', 'category', 'goal_amount', 
            'equity_offered', 'end_date', 'featured_image', 
            'video_url', 'business_plan'
        ]
        widgets = {
            'end_date': forms.DateInput(attrs={'type': 'date'}),
            'description': forms.Textarea(attrs={'rows': 5}),
        }

class InvestmentForm(forms.ModelForm):
    class Meta:
        model = Investment
        fields = ['amount', 'investment_type', 'equity_percentage', 'interest_rate']
        widgets = {
            'amount': forms.NumberInput(attrs={'min': 0}),
            'equity_percentage': forms.NumberInput(attrs={'min': 0, 'max': 100}),
            'interest_rate': forms.NumberInput(attrs={'min': 0, 'max': 100}),
        }

    def clean(self):
        cleaned_data = super().clean()
        investment_type = cleaned_data.get('investment_type')
        equity_percentage = cleaned_data.get('equity_percentage')
        interest_rate = cleaned_data.get('interest_rate')

        if investment_type == 'equity' and not equity_percentage:
            raise forms.ValidationError("Equity percentage is required for equity investments")
        if investment_type == 'loan' and not interest_rate:
            raise forms.ValidationError("Interest rate is required for loan investments")

        return cleaned_data

class ProjectUpdateForm(forms.ModelForm):
    class Meta:
        model = ProjectUpdate
        fields = ['title', 'content', 'image']
        widgets = {
            'content': forms.Textarea(attrs={'rows': 5}),
        }

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['content']
        widgets = {
            'content': forms.Textarea(attrs={'rows': 3, 'placeholder': 'Write your comment here...'}),
        }