from django.db import models

class CrimeCategory(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Faible'),
        ('medium', 'Moyenne'),
        ('high', 'Élevée'),
        ('urgent', 'Urgente'),
    ]
    
    name_fr = models.CharField(max_length=255)
    name_wo = models.CharField(max_length=255)
    description_fr = models.TextField(blank=True, null=True)
    description_wo = models.TextField(blank=True, null=True)
    priority_level = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    color = models.CharField(max_length=7, default='#3B82F6')  # Hex color
    icon = models.CharField(max_length=50, default='AlertTriangle')
    requires_specification = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name_fr']
    
    def __str__(self):
        return self.name_fr