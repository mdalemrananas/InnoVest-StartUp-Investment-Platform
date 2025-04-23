from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import uuid

class CustomUser(AbstractUser):
    email = models.EmailField('email address', unique=True)
    is_email_verified = models.BooleanField(default=False)
    is_investor = models.BooleanField(default=False)
    is_entrepreneur = models.BooleanField(default=False)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=100, blank=True)
    phone_number = models.CharField(max_length=15, blank=True)
    date_joined = models.DateTimeField(default=timezone.now)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return self.email

class EmailVerificationToken(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.email}'s verification token"

class Project(models.Model):
    CATEGORY_CHOICES = [
        ('tech', 'Technology'),
        ('health', 'Healthcare'),
        ('education', 'Education'),
        ('food', 'Food & Beverage'),
        ('fashion', 'Fashion'),
        ('art', 'Art & Design'),
        ('other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    entrepreneur = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='projects')
    goal_amount = models.DecimalField(max_digits=12, decimal_places=2)
    raised_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    equity_offered = models.DecimalField(max_digits=5, decimal_places=2, help_text="Percentage of equity offered")
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    featured_image = models.ImageField(upload_to='project_images/')
    video_url = models.URLField(blank=True, null=True)
    business_plan = models.FileField(upload_to='business_plans/', blank=True, null=True)

    def progress(self):
        if self.goal_amount == 0:
            return 0
        return (self.raised_amount / self.goal_amount) * 100

    def days_left(self):
        return (self.end_date - timezone.now().date()).days

    def __str__(self):
        return self.title

class Investment(models.Model):
    INVESTMENT_TYPES = [
        ('equity', 'Equity'),
        ('loan', 'Loan'),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='investments')
    investor = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='account_investments')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    investment_type = models.CharField(max_length=10, choices=INVESTMENT_TYPES)
    equity_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='pending')

    def __str__(self):
        return f"{self.investor.email} - {self.project.title}"

class ProjectUpdate(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='updates')
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='update_images/', null=True, blank=True)

    def __str__(self):
        return f"{self.project.title} - {self.title}"

class Comment(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='account_comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.project.title}"

class AccessRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='access_requests')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='access_requests')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    requested_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewed_by = models.ForeignKey(
        CustomUser, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='reviewed_requests'
    )
    
    class Meta:
        unique_together = ['user', 'project']
        ordering = ['-requested_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.project.title} ({self.get_status_display()})"


