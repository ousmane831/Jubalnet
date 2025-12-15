# Generated migration for adding health and customs categories

from django.db import migrations


def create_health_customs_categories(apps, schema_editor):
    CrimeCategory = apps.get_model('categories', 'CrimeCategory')
    EmergencyContact = apps.get_model('accounts', 'EmergencyContact')
    
    # Categories for Ministry of Health
    health_categories = [
        {
            'name_fr': 'Fraude pharmaceutique',
            'name_wo': 'Fraude pharmaceutique',
            'description_fr': 'Médicaments contrefaits, ventes illégales de médicaments',
            'description_wo': 'Médicaments yu false, jaay yu dëggu ci médicaments',
            'priority_level': 'high',
            'color': '#DC2626',
            'icon': 'AlertTriangle',
            'requires_specification': False,
            'is_active': True
        },
        {
            'name_fr': 'Trafic de médicaments',
            'name_wo': 'Trafic bu médicaments',
            'description_fr': 'Commerce illégal de médicaments contrôlés',
            'description_wo': 'Commerce bu dëggu ci médicaments controlés',
            'priority_level': 'high',
            'color': '#B91C1C',
            'icon': 'Package',
            'requires_specification': False,
            'is_active': True
        },
        {
            'name_fr': 'Maladie infectieuse',
            'name_wo': 'Maladie infectieuse',
            'description_fr': 'Signalement de maladies infectieuses et épidémies',
            'description_wo': 'Signalement bu maladies infectieuses ak épidémies',
            'priority_level': 'urgent',
            'color': '#991B1B',
            'icon': 'Virus',
            'requires_specification': False,
            'is_active': True
        },
        {
            'name_fr': 'Trafic de drogue',
            'name_wo': 'Trafic bu drogue',
            'description_fr': 'Trafic, vente et consommation de stupéfiants',
            'description_wo': 'Trafic, jaay ak consommation bu stupéfiants',
            'priority_level': 'urgent',
            'color': '#DC2626',
            'icon': 'Shield',
            'requires_specification': False,
            'is_active': True
        },
        {
            'name_fr': 'Contrefaçon',
            'name_wo': 'Contrefaçon',
            'description_fr': 'Produits contrefaits, marchandises de contrefaçon',
            'description_wo': 'Produits yu false, marchandises bu contrefaçon',
            'priority_level': 'high',
            'color': '#EA580C',
            'icon': 'Package',
            'requires_specification': False,
            'is_active': True
        }
    ]
    
    # Create categories
    for category_data in health_categories:
        CrimeCategory.objects.create(**category_data)
    
    # Emergency contacts
    emergency_contacts = [
        {
            'name_fr': 'Ministère de la Santé',
            'name_wo': 'Ministère bu Santé',
            'phone_number': '800 00 20 22',
            'department': 'health',
            'description_fr': 'Signalements sanitaires et pharmaceutiques',
            'description_wo': 'Signalement bu santé ak pharmaceutique',
            'is_active': True,
            'sort_order': 6
        },
        {
            'name_fr': 'Direction Générale des Douanes',
            'name_wo': 'Direction Générale bu Douanes',
            'phone_number': '+221 33 839 50 00',
            'department': 'customs_authority',
            'description_fr': 'Trafic de drogue et contrefaçon',
            'description_wo': 'Trafic bu drogue ak contrefaçon',
            'is_active': True,
            'sort_order': 7
        }
    ]
    
    # Create emergency contacts
    for contact_data in emergency_contacts:
        EmergencyContact.objects.create(**contact_data)


def delete_health_customs_categories(apps, schema_editor):
    CrimeCategory = apps.get_model('categories', 'CrimeCategory')
    EmergencyContact = apps.get_model('accounts', 'EmergencyContact')
    
    # Delete categories
    category_names = [
        'Fraude pharmaceutique', 'Trafic de médicaments', 'Maladie infectieuse',
        'Trafic de drogue', 'Contrefaçon'
    ]
    
    CrimeCategory.objects.filter(name_fr__in=category_names).delete()
    
    # Delete emergency contacts
    contact_names = ['Ministère de la Santé', 'Direction Générale des Douanes']
    EmergencyContact.objects.filter(name_fr__in=contact_names).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('categories', '0001_initial'),
        ('accounts', '0002_add_new_departments'),
    ]

    operations = [
        migrations.RunPython(create_health_customs_categories, delete_health_customs_categories),
    ]
