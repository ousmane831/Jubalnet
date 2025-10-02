from django.db import models
from django.conf import settings

class Complaint(models.Model):
    # Informations sur le plaignant
    plaintiff_first_name = models.CharField(max_length=100)
    plaintiff_last_name = models.CharField(max_length=100)
    plaintiff_birth_date = models.DateField()
    plaintiff_birth_place = models.CharField(max_length=100)
    plaintiff_nationality = models.CharField(max_length=50)
    plaintiff_address = models.CharField(max_length=255)
    plaintiff_city = models.CharField(max_length=100)
    plaintiff_postal_code = models.CharField(max_length=20)

    # Informations sur le défendeur
    defendant_first_name = models.CharField(max_length=100, blank=True, null=True)
    defendant_last_name = models.CharField(max_length=100, blank=True, null=True)
    defendant_birth_date = models.DateField(blank=True, null=True)
    defendant_birth_place = models.CharField(max_length=100, blank=True, null=True)
    defendant_nationality = models.CharField(max_length=50, blank=True, null=True)
    defendant_address = models.CharField(max_length=255, blank=True, null=True)
    defendant_city = models.CharField(max_length=100, blank=True, null=True)
    defendant_postal_code = models.CharField(max_length=20, blank=True, null=True)
    defendant_unknown = models.BooleanField(default=False)

    # Détails de la plainte
    facts = models.TextField()
    lawyer_name = models.CharField(max_length=255, blank=True, null=True)
    lawyer_address = models.CharField(max_length=255, blank=True, null=True)
    complaint_date = models.DateField(auto_now_add=True)
    complaint_city = models.CharField(max_length=100)

    # Pour savoir qui a soumis la plainte (optionnel)
    submitted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return f"Plainte de {self.plaintiff_first_name} {self.plaintiff_last_name}"
    
    
class ComplaintAttachment(models.Model):
    complaint = models.ForeignKey('Complaint', related_name='attachments', on_delete=models.CASCADE)
    file = models.FileField(upload_to='complaints/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name
