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


class ComplaintMessage(models.Model):
    """Modèle pour les messages internes liés à une plainte"""
    complaint = models.ForeignKey(
        'Complaint', 
        related_name='messages', 
        on_delete=models.CASCADE,
        verbose_name="Plainte"
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        verbose_name="Expéditeur"
    )
    message = models.TextField(verbose_name="Message")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    read = models.BooleanField(default=False, verbose_name="Lu")

    class Meta:
        ordering = ['created_at']
        verbose_name = "Message de plainte"
        verbose_name_plural = "Messages de plaintes"
        indexes = [
            models.Index(fields=['complaint', 'created_at']),
            models.Index(fields=['complaint', 'read']),
        ]

    def __str__(self):
        return f"Message de {self.sender.username} pour plainte #{self.complaint.id}"