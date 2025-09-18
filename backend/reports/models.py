from django.db import models
from django.contrib.auth import get_user_model
from categories.models import CrimeCategory

User = get_user_model()

class CrimeReport(models.Model):
    STATUS_CHOICES = [
        ('submitted', 'Soumis'),
        ('reviewing', 'En révision'),
        ('investigating', 'En enquête'),
        ('forwarded', 'Transmis'),
        ('resolved', 'Résolu'),
        ('closed', 'Fermé'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Faible'),
        ('medium', 'Moyenne'),
        ('high', 'Élevée'),
        ('urgent', 'Urgente'),
    ]
    
    LANGUAGE_CHOICES = [
        ('fr', 'Français'),
        ('wo', 'Wolof'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    category = models.ForeignKey(CrimeCategory, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    other_crime_specification = models.CharField(max_length=255, blank=True, null=True)
    
    # Location
    location_text = models.CharField(max_length=255, blank=True, null=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)
    region = models.CharField(max_length=100)
    department = models.CharField(max_length=100, blank=True, null=True)
    commune = models.CharField(max_length=100, blank=True, null=True)
    
    # Incident details
    incident_date = models.DateField()
    incident_time = models.TimeField(null=True, blank=True)
    
    # Status and priority
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='submitted')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    
    # Privacy settings
    is_anonymous = models.BooleanField(default=False)
    contact_allowed = models.BooleanField(default=True)
    
    # Metadata
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, default='fr')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    assigned_authority = models.ForeignKey('accounts.Authority', on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.get_status_display()}"

class ReportMedia(models.Model):
    MEDIA_TYPE_CHOICES = [
        ('image', 'Image'),
        ('video', 'Vidéo'),
        ('audio', 'Audio'),
        ('document', 'Document'),
    ]
    
    report = models.ForeignKey(CrimeReport, on_delete=models.CASCADE, related_name='media_files')
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPE_CHOICES)
    file = models.FileField(upload_to='reports/media/%Y/%m/%d/')
    file_name = models.CharField(max_length=255)
    file_size = models.PositiveIntegerField()
    mime_type = models.CharField(max_length=100)
    transcription = models.TextField(blank=True, null=True)  # For audio files
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.report.title} - {self.file_name}"

class VoiceReport(models.Model):
    report = models.OneToOneField(CrimeReport, on_delete=models.CASCADE, related_name='voice_report')
    audio_file = models.FileField(upload_to='reports/voice/%Y/%m/%d/')
    duration_seconds = models.PositiveIntegerField()
    transcription_fr = models.TextField(blank=True, null=True)
    transcription_wo = models.TextField(blank=True, null=True)
    transcription_confidence = models.FloatField(default=0.0)
    is_processed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Voice Report - {self.report.title}"

class ReportStatus(models.Model):
    report = models.ForeignKey(CrimeReport, on_delete=models.CASCADE, related_name='status_history')
    status = models.CharField(max_length=20, choices=CrimeReport.STATUS_CHOICES)
    comment = models.TextField(blank=True, null=True)
    updated_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.report.title} - {self.get_status_display()}"