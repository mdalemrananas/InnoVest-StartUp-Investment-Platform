from django.db import models

# Create your models here.

class CommunityPost(models.Model):
    POST_TYPES = [
        ('Discussion', 'Discussion'),
        ('Project Update', 'Project Update'),
        ('Question', 'Question'),
        ('Idea', 'Idea'),
        ('Other', 'Other'),
        ('Event', 'Event'),
    ]
    VISIBILITY_CHOICES = [
        ('public', 'Public'),
        ('private', 'Private'),
    ]
    title = models.CharField(max_length=200)
    type = models.CharField(max_length=32, choices=POST_TYPES)
    visibility = models.CharField(max_length=10, choices=VISIBILITY_CHOICES, default='public')
    tags = models.CharField(max_length=300, blank=True, help_text='Comma-separated tags')
    description = models.TextField()
    attachment = models.FileField(upload_to='community_attachments/', blank=True, null=True)
    # Event-specific fields
    eventLocation = models.CharField(max_length=200, blank=True)
    eventLocationLink = models.URLField(blank=True)
    eventStartDateTime = models.DateTimeField(blank=True, null=True)
    eventEndDateTime = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
