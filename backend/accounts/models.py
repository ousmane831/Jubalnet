from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('citizen', 'Citoyen'),
        ('authority', 'Autorité'),
        ('admin', 'Administrateur'),
        ('moderator', 'Modérateur'),
    ]
    
    LANGUAGE_CHOICES = [
        ('fr', 'Français'),
        ('wo', 'Wolof'),
    ]
    
    phone = models.CharField(max_length=20, blank=True, null=True)
    full_name = models.CharField(max_length=255, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='citizen')
    is_anonymous = models.BooleanField(default=False)
    preferred_language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, default='fr')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.full_name or self.username

class Authority(models.Model):
    DEPARTMENT_CHOICES = [
        ('police', 'Police'),
        ('gendarmerie', 'Gendarmerie'),
        ('justice', 'Justice'),
        ('customs', 'Douanes'),
        ('cybercrime', 'Cybercriminalité'),
        ('anticorruption', 'Anti-corruption'),
        ('health', 'Ministère de la santé et de l\'hygiène publique'),
        ('customs_authority', 'Autorité des douanes'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    department = models.CharField(max_length=20, choices=DEPARTMENT_CHOICES)
    jurisdiction_region = models.CharField(max_length=100, blank=True, null=True)
    jurisdiction_department = models.CharField(max_length=100, blank=True, null=True)
    badge_number = models.CharField(max_length=50, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.full_name} - {self.get_department_display()}"

class EmergencyContact(models.Model):
    name_fr = models.CharField(max_length=255)
    name_wo = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    department = models.CharField(max_length=50)
    description_fr = models.TextField(blank=True, null=True)
    description_wo = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['sort_order', 'name_fr']
    
    def __str__(self):
        return self.name_fr