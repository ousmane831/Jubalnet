#!/usr/bin/env python3
"""
Script pour ajouter les nouvelles catégories de crimes et contacts d'urgence
"""

import json
import psycopg2
import os
from decouple import config

def add_categories_to_db():
    try:
        # Connexion à PostgreSQL
        conn = psycopg2.connect(
            host=config('DB_HOST', default='localhost'),
            database=config('DB_NAME', default='crime_report_db'),
            user=config('DB_USER', default='crime'),
            password=config('DB_PASSWORD', default='CYBERCRIME2025'),
            port=config('DB_PORT', default='5432')
        )
        cursor = conn.cursor()
        
        print("Connecté à la base de données PostgreSQL")
        
        # Nouvelles catégories à ajouter
        categories = [
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
        
        # Ajouter les catégories
        for cat in categories:
            # Vérifier si la catégorie existe déjà
            cursor.execute(
                "SELECT id FROM categories_crimecategory WHERE name_fr = %s",
                (cat['name_fr'],)
            )
            if cursor.fetchone() is None:
                cursor.execute("""
                    INSERT INTO categories_crimecategory 
                    (name_fr, name_wo, description_fr, description_wo, priority_level, 
                     color, icon, requires_specification, is_active, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
                """, (
                    cat['name_fr'], cat['name_wo'], cat['description_fr'], cat['description_wo'],
                    cat['priority_level'], cat['color'], cat['icon'], cat['requires_specification'],
                    cat['is_active']
                ))
                print(f"Ajouté: {cat['name_fr']}")
            else:
                print(f"Déjà existant: {cat['name_fr']}")
        
        # Contacts d'urgence
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
        
        # Ajouter les contacts d'urgence
        for contact in emergency_contacts:
            cursor.execute(
                "SELECT id FROM accounts_emergencycontact WHERE name_fr = %s",
                (contact['name_fr'],)
            )
            if cursor.fetchone() is None:
                cursor.execute("""
                    INSERT INTO accounts_emergencycontact 
                    (name_fr, name_wo, phone_number, department, description_fr, 
                     description_wo, is_active, sort_order)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    contact['name_fr'], contact['name_wo'], contact['phone_number'],
                    contact['department'], contact['description_fr'], contact['description_wo'],
                    contact['is_active'], contact['sort_order']
                ))
                print(f"Ajouté contact: {contact['name_fr']}")
            else:
                print(f"Contact déjà existant: {contact['name_fr']}")
        
        conn.commit()
        cursor.close()
        conn.close()
        print("Opération terminée avec succès!")
        return True
        
    except Exception as e:
        print(f"Erreur: {e}")
        return False

if __name__ == "__main__":
    add_categories_to_db()
