from django.db import models

class RegisteredUser(models.Model):
    full_name = models.CharField(max_length=255)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    verification_code = models.CharField(max_length=100)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.username


class ProfileDescription(models.Model):
    username = models.CharField(max_length=150)
    email = models.EmailField()

    def __str__(self):
        return self.username

