# Script de migration pour assigner les départements aux signalements existants

import os
import sys
import django

# Configuration de l'environnement Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'crime_report.settings')
django.setup()

from reports.models import CrimeReport, CrimeCategory
from accounts.models import User

# Mapping des catégories vers les départements
CATEGORY_DEPARTMENT_MAPPING = {
    # Commission des Données Personnelles (CDP)
    'usurpation_identité': 'cdp',
    'usurpation d\'identité': 'cdp',
    'piratage_compte': 'cdp',
    'piratage de compte': 'cdp',
    'diffusion_donnees': 'cdp',
    'diffusion non autorisée de données personnelles': 'cdp',
    
    # Division Spéciale de la Cybercriminalité (DSC)
    'phishing': 'dsc',
    'hameçonnage': 'dsc',
    'phishing / hameçonnage': 'dsc',
    'escroquerie_ligne': 'dsc',
    'escroquerie en ligne': 'dsc',
    'cyberharcèlement': 'dsc',
    
    # Police (zones urbaines)
    'vol_urbain': 'police',
    'vol et cambriolage': 'police',
    'violence_urbaine': 'police',
    'violence et agression': 'police',
    'harcèlement_physique_urbain': 'police',
    'harcèlement': 'police',
    
    # Gendarmerie (zones rurales)
    'vol_rural': 'gendarmerie',
    'violence_rurale': 'gendarmerie',
    'harcèlement_physique_rural': 'gendarmerie'
}

# Liste des régions urbaines du Sénégal
URBAN_REGIONS = [
    'dakar', 'guédiawaye', 'pikine', 'rufisque', 'thiès', 'saint-louis', 'kaolack'
]

# Liste des régions rurales principales
RURAL_REGIONS = [
    'tambacounda', 'kédougou', 'sédhiou', 'kolda', 'ziguinchor', 'fatick', 'diourbel',
    'louga', 'matam', 'bakel', 'ouro sogui', 'vélingara'
]

def classify_report(category_name, region, description=None):
    """Classifie un signalement selon sa catégorie et sa localisation"""
    
    # Normaliser le nom de la catégorie
    normalized_category = category_name.lower().strip()
    
    # Chercher une correspondance directe
    if normalized_category in CATEGORY_DEPARTMENT_MAPPING:
        return CATEGORY_DEPARTMENT_MAPPING[normalized_category]
    
    # Classification basée sur les mots-clés dans la description
    if description:
        desc_lower = description.lower()
        
        # Mots-clés CDP
        if (desc_lower.contains('identité') or desc_lower.contains('données personnelles') or 
            desc_lower.contains('piratage') or desc_lower.contains('compte')):
            return 'cdp'
        
        # Mots-clés DSC
        if (desc_lower.contains('phishing') or desc_lower.contains('hameçonnage') or 
            desc_lower.contains('escroquerie') or desc_lower.contains('internet') or
            desc_lower.contains('en ligne') or desc_lower.contains('cyber')):
            return 'dsc'
    
    # Classification par localisation pour les crimes généraux
    region_lower = region.lower()
    is_urban = any(urban in region_lower for urban in URBAN_REGIONS)
    is_rural = any(rural in region_lower for rural in RURAL_REGIONS)
    
    # Catégories générales selon localisation
    if ('vol' in normalized_category or 'cambriol' in normalized_category):
        if is_urban:
            return 'police'
        elif is_rural:
            return 'gendarmerie'
    
    if ('violence' in normalized_category or 'agression' in normalized_category):
        if is_urban:
            return 'police'
        elif is_rural:
            return 'gendarmerie'
    
    if ('harcèlement' in normalized_category):
        if is_urban:
            return 'police'
        elif is_rural:
            return 'gendarmerie'
    
    # Par défaut, assigner à la Police
    return 'police'

def migrate_reports():
    """Migration des signalements existants pour assigner les départements"""
    
    print("Début de la migration des signalements...")
    
    # Compter les signalements à traiter
    total_reports = CrimeReport.objects.count()
    print(f"Nombre total de signalements: {total_reports}")
    
    # Récupérer toutes les catégories pour le mapping
    categories = {cat.id: cat.name_fr for cat in CrimeCategory.objects.all()}
    
    updated_count = 0
    error_count = 0
    
    for report in CrimeReport.objects.all():
        try:
            # Obtenir le nom de la catégorie
            category_name = categories.get(report.category_id, '')
            
            # Classer le signalement
            department = classify_report(
                category_name,
                report.region or '',
                report.description
            )
            
            # Trouver une autorité du département correspondant
            authority_user = User.objects.filter(
                role='authority',
                department=department,
                is_active=True
            ).first()
            
            if authority_user:
                # Assigner le signalement à cette autorité
                report.assigned_authority_id = authority_user.id
                report.save(update_fields=['assigned_authority_id'])
                updated_count += 1
                print(f"Signalement {report.id} assigné à {department} ({authority_user.full_name})")
            else:
                # Si aucune autorité trouvée, au moins sauvegarder le département dans un champ personnalisé
                # ou créer un log pour suivi manuel
                print(f"Aucune autorité trouvée pour le département {department} du signalement {report.id}")
                error_count += 1
                
        except Exception as e:
            print(f"Erreur lors du traitement du signalement {report.id}: {str(e)}")
            error_count += 1
    
    print(f"\nMigration terminée:")
    print(f"- Signalements mis à jour: {updated_count}")
    print(f"- Erreurs: {error_count}")
    print(f"- Total traité: {updated_count + error_count}")

if __name__ == "__main__":
    migrate_reports()
