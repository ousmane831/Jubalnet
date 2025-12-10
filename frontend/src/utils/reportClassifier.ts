// Utilitaire de classification des signalements par département
export interface ReportClassification {
  department: 'cdp' | 'dsc' | 'police' | 'gendarmerie';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reason: string;
}

// Mapping des catégories de crimes vers les départements
export const CATEGORY_DEPARTMENT_MAPPING: Record<string, ReportClassification> = {
  // Commission des Données Personnelles (CDP)
  'usurpation_identité': {
    department: 'cdp',
    priority: 'high',
    reason: 'Usurpation d\'identité - compétence CDP'
  },
  'usurpation d\'identité': {
    department: 'cdp',
    priority: 'high',
    reason: 'Usurpation d\'identité - compétence CDP'
  },
  'piratage_compte': {
    department: 'cdp',
    priority: 'high',
    reason: 'Piratage de compte - compétence CDP'
  },
  'piratage de compte': {
    department: 'cdp',
    priority: 'high',
    reason: 'Piratage de compte - compétence CDP'
  },
  'diffusion_donnees': {
    department: 'cdp',
    priority: 'urgent',
    reason: 'Diffusion non autorisée de données personnelles - compétence CDP'
  },
  'diffusion non autorisée de données personnelles': {
    department: 'cdp',
    priority: 'urgent',
    reason: 'Diffusion non autorisée de données personnelles - compétence CDP'
  },

  // Division Spéciale de la Cybercriminalité (DSC)
  'phishing': {
    department: 'dsc',
    priority: 'high',
    reason: 'Phishing/Hameçonnage - compétence DSC'
  },
  'hameçonnage': {
    department: 'dsc',
    priority: 'high',
    reason: 'Phishing/Hameçonnage - compétence DSC'
  },
  'phishing / hameçonnage': {
    department: 'dsc',
    priority: 'high',
    reason: 'Phishing/Hameçonnage - compétence DSC'
  },
  'escroquerie_ligne': {
    department: 'dsc',
    priority: 'high',
    reason: 'Escroquerie en ligne - compétence DSC'
  },
  'escroquerie en ligne': {
    department: 'dsc',
    priority: 'high',
    reason: 'Escroquerie en ligne - compétence DSC'
  },
  'cyberharcèlement': {
    department: 'dsc',
    priority: 'urgent',
    reason: 'Cyberharcèlement - compétence DSC'
  },

  // Police (zones urbaines)
  'vol_urbain': {
    department: 'police',
    priority: 'medium',
    reason: 'Vol et Cambriolage (zone urbaine) - compétence Police'
  },
  // 'vol et cambriolage' - sera traité par la logique de localisation plus bas
  'violence_urbaine': {
    department: 'police',
    priority: 'urgent',
    reason: 'Violence et Agression (zone urbaine) - compétence Police'
  },
  // 'violence et agression' - sera traité par la logique de localisation plus bas
  'harcèlement_physique_urbain': {
    department: 'police',
    priority: 'high',
    reason: 'Harcèlement physique/moral (zone urbaine) - compétence Police'
  },
  // 'harcèlement' - sera traité par la logique de localisation plus bas

  // Gendarmerie (zones rurales)
  'vol_rural': {
    department: 'gendarmerie',
    priority: 'medium',
    reason: 'Vol et Cambriolage (zone rurale) - compétence Gendarmerie'
  },
  'violence_rurale': {
    department: 'gendarmerie',
    priority: 'urgent',
    reason: 'Violence et Agression (zone rurale) - compétence Gendarmerie'
  },
  'harcèlement_physique_rural': {
    department: 'gendarmerie',
    priority: 'high',
    reason: 'Harcèlement physique/moral (zone rurale) - compétence Gendarmerie'
  }
};

// Liste des régions du Sénégal (zones urbaines principales)
export const URBAN_REGIONS = [
  'Dakar', 'Guédiawaye', 'Pikine', 'Rufisque', 'Thiès', 'Saint-Louis', 'Kaolack'
];

// Liste des régions rurales principales
export const RURAL_REGIONS = [
  'Tambacounda', 'Kédougou', 'Sédhiou', 'Kolda', 'Ziguinchor', 'Fatick', 'Diourbel',
  'Louga', 'Matam', 'Saint-Louis', 'Bakel', 'Ouro Sogui', 'Vélingara'
];

export class ReportClassifier {
  // Mapping des logos pour chaque département
  static getDepartmentLogos(): Record<string, string> {
    return {
      cdp: '/src/assets/departments/cdp-logo.png',
      dsc: '/src/assets/departments/dsc-logo.png',
      police: '/src/assets/departments/police-logo.png',
      gendarmerie: '/src/assets/departments/gendarmerie-logo.png'
    };
  }

  /**
   * Classifie un signalement selon sa catégorie et sa localisation
   */
  static classifyReport(
    categoryName: string,
    region: string,
    description?: string
  ): ReportClassification {
    // Normaliser le nom de la catégorie
    const normalizedCategory = categoryName.toLowerCase().trim();
    
    // Chercher une correspondance directe
    const directMapping = CATEGORY_DEPARTMENT_MAPPING[normalizedCategory];
    if (directMapping) {
      return directMapping;
    }

    // Classification basée sur les mots-clés dans la description
    if (description) {
      const descLower = description.toLowerCase();
      
      // Mots-clés CDP
      if (descLower.includes('identité') || descLower.includes('données personnelles') || 
          descLower.includes('piratage') || descLower.includes('compte')) {
        return {
          department: 'cdp',
          priority: 'high',
          reason: 'Mots-clés CDP détectés dans la description'
        };
      }
      
      // Mots-clés DSC
      if (descLower.includes('phishing') || descLower.includes('hameçonnage') || 
          descLower.includes('escroquerie') || descLower.includes('internet') ||
          descLower.includes('en ligne') || descLower.includes('cyber')) {
        return {
          department: 'dsc',
          priority: 'high',
          reason: 'Mots-clés cybercriminalité détectés dans la description'
        };
      }
    }

    // Classification par localisation pour les crimes généraux
    const isUrban = URBAN_REGIONS.some(urbanRegion => 
      region.toLowerCase().includes(urbanRegion.toLowerCase())
    );
    
    const isRural = RURAL_REGIONS.some(ruralRegion => 
      region.toLowerCase().includes(ruralRegion.toLowerCase())
    );

    // Catégories générales selon localisation
    if (normalizedCategory.includes('vol') || normalizedCategory.includes('cambriol')) {
      if (isUrban) {
        return {
          department: 'police',
          priority: 'medium',
          reason: 'Vol/Cambriolage en zone urbaine - compétence Police'
        };
      } else if (isRural) {
        return {
          department: 'gendarmerie',
          priority: 'medium',
          reason: 'Vol/Cambriolage en zone rurale - compétence Gendarmerie'
        };
      }
    }

    if (normalizedCategory.includes('violence') || normalizedCategory.includes('agression')) {
      if (isUrban) {
        return {
          department: 'police',
          priority: 'urgent',
          reason: 'Violence/Agression en zone urbaine - compétence Police'
        };
      } else if (isRural) {
        return {
          department: 'gendarmerie',
          priority: 'urgent',
          reason: 'Violence/Agression en zone rurale - compétence Gendarmerie'
        };
      }
    }

    if (normalizedCategory.includes('harcèlement')) {
      if (isUrban) {
        return {
          department: 'police',
          priority: 'high',
          reason: 'Harcèlement en zone urbaine - compétence Police'
        };
      } else if (isRural) {
        return {
          department: 'gendarmerie',
          priority: 'high',
          reason: 'Harcèlement en zone rurale - compétence Gendarmerie'
        };
      }
    }

    // Par défaut, assigner à la Police si aucune classification spécifique
    return {
      department: 'police',
      priority: 'medium',
      reason: 'Classification par défaut - compétence Police'
    };
  }

  /**
   * Vérifie si un utilisateur peut voir un signalement selon son département
   */
  static canUserViewReport(
    userDepartment: string | null | undefined,
    reportDepartment: string,
    userRole: string
  ): boolean {
    // Les admins et modérateurs voient tout
    if (userRole === 'admin' || userRole === 'moderator') {
      return true;
    }

    // Les autorités ne voient que les signalements de leur département
    if (userRole === 'authority' && userDepartment) {
      return userDepartment === reportDepartment;
    }

    return false;
  }

  /**
   * Filtre les signalements visibles pour un utilisateur
   */
  static filterReportsForUser(
    reports: any[],
    userDepartment: string | null | undefined,
    userRole: string
  ): any[] {
    if (userRole === 'admin' || userRole === 'moderator') {
      return reports;
    }

    if (userRole === 'authority' && userDepartment) {
      return reports.filter(report => {
        const classification = this.classifyReport(
          report.category?.name_fr || '',
          report.region || '',
          report.description
        );
        return classification.department === userDepartment;
      });
    }

    return [];
  }

  /**
   * Obtient les départements avec leur description
   */
  static getDepartmentInfo(): Record<string, { name: string; description: string; color: string }> {
    return {
      cdp: {
        name: 'Commission des Données Personnelles',
        description: 'Protection des données personnelles et vie privée',
        color: '#8B5CF6'
      },
      dsc: {
        name: 'Division Spéciale de la Cybercriminalité',
        description: 'Lutte contre la cybercriminalité',
        color: '#3B82F6'
      },
      police: {
        name: 'Police Nationale',
        description: 'Sécurité en zones urbaines',
        color: '#EF4444'
      },
      gendarmerie: {
        name: 'Gendarmerie Nationale',
        description: 'Sécurité en zones rurales',
        color: '#10B981'
      }
    };
  }
}
