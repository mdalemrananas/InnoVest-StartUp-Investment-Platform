from django.db import models

class CompanyTrackProgress(models.Model):
    company_id = models.BigIntegerField()
    notice = models.TextField(blank=True, null=True)
    current_company_valuation = models.FloatField(blank=True, null=True)
    revenue_rate = models.FloatField(blank=True, null=True)
    burn_rate = models.FloatField(blank=True, null=True)
    retention_rate = models.FloatField(blank=True, null=True)
    investment_documents = models.TextField(blank=True, null=True)  # store as JSON string
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'company_track_progress'

class CompanyUpdate(models.Model):
    company_id = models.BigIntegerField()
    title = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'company_update' 