import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'fr' | 'wo';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.report': 'Signaler',
    'nav.my_reports': 'Mes Signalements',
    'nav.prevention': 'Prévention',
    'nav.emergency': 'Urgences',
    'nav.profile': 'Profil',
    'nav.dashboard': 'Tableau de Bord',
    
    // Home Page
    'home.title': 'Plateforme de signalement',
    'home.subtitle': 'Signalez. Protéger ensemble.',
    'home.report_crime': 'Signaler un Crime',
    'home.view_reports': 'Mes Signalements',
    'home.emergency_contacts': 'Contacts d\'Urgence',
    'home.statistics.title': 'Statistiques Nationales',
    'home.statistics.total_reports': 'Signalements Total',
    'home.statistics.resolved': 'Résolus',
    'home.statistics.in_progress': 'En Cours',
    
    // Report Form
    'report.title': 'Nouveau Signalement',
    'report.category': 'Catégorie de Crime',
    'report.description': 'Description Détaillée',
    'report.location': 'Localisation',
    'report.date': 'Date de l\'Incident',
    'report.time': 'Heure de l\'Incident',
    'report.anonymous': 'Signalement Anonyme',
    'report.submit': 'Soumettre le Signalement',
    'report.voice_mode': 'Signalement Vocal',
    'report.form_mode': 'Signalement Écrit',
    
    // Crime Categories
    'category.harassment': 'Harcèlement',
    'category.identity_theft': 'Usurpation d\'identité',
    'category.money_laundering': 'Blanchiment de capitaux',
    'category.corruption': 'Corruption',
    'category.theft': 'Vol et Cambriolage',
    'category.violence': 'Violence et Agression',
    'category.others': 'Autres',
    
    // Status
    'status.submitted': 'Soumis',
    'status.reviewing': 'En Révision',
    'status.investigating': 'En Enquête',
    'status.forwarded': 'Transmis',
    'status.resolved': 'Résolu',
    'status.closed': 'Fermé',
    
    // Common
    'common.loading': 'Chargement...',
    'common.submit': 'Soumettre',
    'common.cancel': 'Annuler',
    'common.save': 'Sauvegarder',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',
  },
  wo: {
     // Navigation
    'nav.home': 'Kër',
    'nav.report': 'xamale',
    'nav.my_reports': 'Samay xamle',
    'nav.prevention': 'fàggu',
    'nav.emergency': 'cëtëŋ ',
    'nav.profile': 'Profil',
    'nav.dashboard': 'Tabloam',
    
    // Home Page
    'home.title': 'Platformu xamle',
    'home.subtitle': 'xamal.Aar benn benn. ',
    'home.report_crime': 'Xamal njubba',
    'home.view_reports':'Samay xamle',
    'home.emergency_contacts': 'Numéru ndimbal gaaw',
    'home.statistics.title': 'Statistik bu réew mi',
    'home.statistics.total_reports': 'Xamle yépp',
    'home.statistics.resolved': 'Sotti',
    'home.statistics.in_progress': 'Ci yoon wi',
    
    // Report Form
    'report.title': 'Baxal bu Bees',
    'report.category': 'Mbind Njub',
    'report.description': 'Xalaat bu Jëm',
    'report.location': 'Bër',
    'report.date': 'Beesu Njub bi',
    'report.time': 'Waxtu Njub bi',
    'report.anonymous': 'Baxal bu Sutura',
    'report.submit': 'Yónnee Baxal',
    'report.voice_mode': 'Baxal ak Baat',
    'report.form_mode': 'Baxal ak Bind',
    
    // Categories remain mostly in French for official purposes
    'category.harassment': 'Harcèlement',
    'category.identity_theft': 'Fekkante identité',
    'category.money_laundering': 'Blanchiment bu xaalis',
    'category.corruption': 'Sëpp',
    'category.theft': 'Sàcc ak Këru Kër',
    'category.violence': 'Fit ak Njëbul',
    'category.others': 'Yeneen',
    
    // Status
    'status.submitted': 'Yónnee',
    'status.reviewing': 'Ci Gis',
    'status.investigating': 'Ci Wut',
    'status.forwarded': 'Yónnee',
    'status.resolved': 'Jaax',
    'status.closed': 'Tax',
    
    // Common
    'common.loading': 'Daje...',
    'common.submit': 'Yónnee',
    'common.cancel': 'Nees',
    'common.save': 'Dëkku',
    'common.edit': 'Soppi',
    'common.delete': 'Dindi',
    'common.back': 'Dellu',
    'common.next': 'Ci topp',
    'common.previous': 'Ci ginaw',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred_language') as Language;
    if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'wo')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('preferred_language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};