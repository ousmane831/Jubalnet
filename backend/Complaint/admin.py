from django.contrib import admin
from .models import Complaint, ComplaintAttachment

class ComplaintAttachmentInline(admin.TabularInline):
    model = ComplaintAttachment
    extra = 1  # nombre de lignes vides supplémentaires
    fields = ('file', 'uploaded_at')
    readonly_fields = ('uploaded_at',)

@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    # Champs à afficher dans la liste principale
    list_display = (
        'plaintiff_first_name',
        'plaintiff_last_name',
        'defendant_first_name',
        'defendant_last_name',
        'complaint_date',
        'complaint_city',
        'submitted_by',
    )

    # Champs cliquables pour accéder à la fiche complète
    list_display_links = ('plaintiff_first_name', 'plaintiff_last_name')

    # Filtres dans la colonne de droite
    list_filter = ('complaint_date', 'complaint_city', 'submitted_by')

    # Barre de recherche
    search_fields = (
        'plaintiff_first_name',
        'plaintiff_last_name',
        'defendant_first_name',
        'defendant_last_name',
        'complaint_city',
        'facts',
        'lawyer_name',
    )

    # Organisation des champs dans la page de modification
    fieldsets = (
        ('Informations sur le plaignant', {
            'fields': (
                'plaintiff_first_name', 'plaintiff_last_name',
                'plaintiff_birth_date', 'plaintiff_birth_place',
                'plaintiff_nationality', 'plaintiff_address',
                'plaintiff_city', 'plaintiff_postal_code',
            )
        }),
        ('Informations sur le défendeur', {
            'fields': (
                'defendant_first_name', 'defendant_last_name',
                'defendant_birth_date', 'defendant_birth_place',
                'defendant_nationality', 'defendant_address',
                'defendant_city', 'defendant_postal_code', 'defendant_unknown',
            )
        }),
        ('Détails de la plainte', {
            'fields': (
                'facts',  'lawyer_name', 'lawyer_address',
                'complaint_date', 'complaint_city', 'submitted_by',
            )
        }),
    )

    # Champs readonly (ici la date de la plainte)
    readonly_fields = ('complaint_date',)

    # 🔹 Ajouter l'inline pour les pièces jointes
    inlines = [ComplaintAttachmentInline]
