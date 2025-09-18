from django.contrib import admin
from .models import CrimeCategory

@admin.register(CrimeCategory)
class CrimeCategoryAdmin(admin.ModelAdmin):
    # Champs à afficher dans la liste
    list_display = ('name_fr', 'name_wo', 'priority_level', 'is_active', 'requires_specification', 'created_at')
    
    # Champs filtrables
    list_filter = ('priority_level', 'is_active', 'requires_specification')
    
    # Champs recherchables
    search_fields = ('name_fr', 'name_wo', 'description_fr', 'description_wo')
    
    # Champs éditables directement depuis la liste
    list_editable = ('priority_level', 'is_active', 'requires_specification')
    
    # Ordre par défaut
    ordering = ('name_fr',)
    
    # Lecture seule
    readonly_fields = ('created_at',)
