import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export const Confidentialite: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {language === 'fr' ? 'Politique de Confidentialité' : 'Politique bu Sutura'}
      </h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          {language === 'fr' ? 'Collecte des informations' : 'Jëfandikoo xibaar yi'}
        </h2>
        <p className="text-gray-700">
          {language === 'fr'
            ? 'Nous collectons uniquement les informations nécessaires pour fournir nos services et améliorer votre sécurité.'
            : 'Nun amna jëfandikoo xibaar yu neex ngir jëfandikoo services yi ak xoolal sa sécurité.'}
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          {language === 'fr' ? 'Utilisation des informations' : 'Jëfandikoo xibaar yi'}
        </h2>
        <p className="text-gray-700">
          {language === 'fr'
            ? 'Vos données sont utilisées uniquement pour la gestion de la plateforme et la protection de votre sécurité.'
            : 'Xibaar yu bopp nga, dinañu jëf ci gestion plateforme bi ak xoolal sa sécurité.'}
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          {language === 'fr' ? 'Partage des informations' : 'Nekk ci xibaar yi'}
        </h2>
        <p className="text-gray-700">
          {language === 'fr'
            ? 'Nous ne partageons pas vos informations personnelles avec des tiers sans votre consentement, sauf obligation légale.'
            : 'Nun duñu nekk xibaar yu bopp nga ak benn yu benn su lañu am sa consentement, sauf obligation légale.'}
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          {language === 'fr' ? 'Sécurité des données' : 'Sutura ci xibaar yi'}
        </h2>
        <p className="text-gray-700">
          {language === 'fr'
            ? 'Nous mettons en place des mesures techniques et organisationnelles pour protéger vos données.'
            : 'Nun def nañu yoon yu technique ak organisation ngir jëkk xibaar yi.'}
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          {language === 'fr' ? 'Vos droits' : 'Sa jëf'}
        </h2>
        <p className="text-gray-700">
          {language === 'fr'
            ? 'Vous pouvez demander l’accès, la correction ou la suppression de vos données personnelles.'
            : 'Am nga sa jëf ngir wut, defal walla delete xibaar yu bopp nga.'}
        </p>
      </section>
    </div>
  );
};
