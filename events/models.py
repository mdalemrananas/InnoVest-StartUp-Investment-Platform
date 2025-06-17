from django.db import models
from authentication.models import CustomUser

class CompanyEvent(models.Model):
    PRIVACY_CHOICES = [
        ('hidden', 'Hidden'),
        ('publish', 'Publish'),
    ]

    id = models.AutoField(primary_key=True, db_column='id')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, db_column='user_id')
    title = models.TextField(db_column='title')
    description = models.TextField(null=True, blank=True, db_column='description')
    cover_image = models.ImageField(upload_to='event_images/', null=True, blank=True, db_column='cover_image')
    location = models.TextField(null=True, blank=True, db_column='location')
    location_link = models.TextField(null=True, blank=True, db_column='location_link')
    categories = models.TextField(null=True, blank=True, db_column='categories')
    registration_form = models.TextField(null=True, blank=True, db_column='registration_form')
    privacy = models.TextField(db_column='privacy')
    start_at = models.DateTimeField(null=True, db_column='start_at')
    end_at = models.DateTimeField(null=True, db_column='end_at')
    registration_end = models.DateTimeField(null=True, blank=True, db_column='registration_end')
    created_at = models.DateTimeField(auto_now_add=True, db_column='created_at')
    updated_at = models.DateTimeField(auto_now=True, db_column='updated_at')

    class Meta:
        db_table = 'company_event'
        managed = False
        ordering = ['-start_at']

    def __str__(self):
        return str(self.title)