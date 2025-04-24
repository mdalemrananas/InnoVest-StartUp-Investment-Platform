from django.db import models
from django.utils import timezone

# Create your models here.

class ProjectUpdate(models.Model):
    project_title = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.DateField()
    expense_amount = models.DecimalField(max_digits=10, decimal_places=2)
    completion_percentage = models.IntegerField()
    expense_percentage = models.IntegerField()
    total_budget = models.DecimalField(max_digits=10, decimal_places=2)
    remaining_amount = models.DecimalField(max_digits=10, decimal_places=2)
    time_remaining = models.DateField()
    attachment = models.FileField(upload_to='project_attachments/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.project_title
