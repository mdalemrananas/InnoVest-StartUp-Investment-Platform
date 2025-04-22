from django.db import models

from django.db import models
from django.contrib.auth.models import User

class Project(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    fundraiser = models.ForeignKey(User, on_delete=models.CASCADE, related_name='funded_projects')
    investors = models.ManyToManyField(User, related_name='invested_projects', blank=True)
    budget = models.FloatField()
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return self.title

class ProgressUpdate(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='progress_updates')
    update_title = models.CharField(max_length=255)
    description = models.TextField()
    percent_complete = models.IntegerField()
    expense_used = models.FloatField()
    report_file = models.FileField(upload_to='progress_reports/', blank=True, null=True)
    image = models.ImageField(upload_to='progress_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.project.title} - {self.update_title}"

