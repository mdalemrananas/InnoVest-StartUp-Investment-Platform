from django.db import models

class CompanyInfo(models.Model):
    company_name = models.CharField(max_length=255)
    quick_description = models.TextField()
    industry = models.CharField(max_length=255)
    country = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    company_image = models.ImageField(upload_to='company_images/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.company_name
