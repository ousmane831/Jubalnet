import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface VosDroitsProps {
  onPageChange: (page: string) => void;
}

export const VosDroits: React.FC<VosDroitsProps> = ({ onPageChange }) => {
  const { language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {language === 'fr' ? 'Vos Droits' : 'Sa Jëf'}
      </h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          {language === 'fr' ? 'Droit à la sécurité' : 'Jëf ci sécurité'}
        </h2>
        <p className="text-gray-700">
          {language === 'fr'
            ? 'Vous avez le droit de vivre dans un environnement sûr et de signaler toute situation dangereuse aux autorités.'
            : 'Am nga sa jëf ngir dem ci kër yu sûrek ak baxal xeet yu jafe ci autorités.'}
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          {language === 'fr' ? 'Droit à l’information' : 'Jëf ci xibaar yi'}
        </h2>
        <p className="text-gray-700">
          {language === 'fr'
            ? 'Vous avez le droit d’accéder à des informations claires concernant vos droits et les procédures de signalement.'
            : 'Am nga sa jëf ngir am xibaar yu tëdd ci sa jëf ak procedure yi ngir baxal.'}
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          {language === 'fr' ? 'Protection juridique' : 'Ndimbalante juridiques'}
        </h2>
        <p className="text-gray-700">
          {language === 'fr'
            ? 'Vous avez le droit d’être accompagné par des services juridiques en cas de problème ou d’abus.'
            : 'Am nga sa jëf ngir ndimbalante juridiques su jafe walla abus am na.'}
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          {language === 'fr' ? 'Confidentialité' : 'Sutura'}
        </h2>
        <p className="text-gray-700">
          {language === 'fr'
            ? 'Vos informations personnelles doivent être protégées et ne peuvent être divulguées sans votre consentement.'
            : 'Xibaar yu bopp nga, dinañu am sutura te duñu defalal su lañu am sa consentement.'}
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          {language === 'fr' ? 'Signaler un incident' : 'Baxal xeet yu jafe'}
        </h2>
        <p className="text-gray-700">
          {language === 'fr'
            ? 'En cas d’incident ou de situation suspecte, contactez immédiatement les autorités ou utilisez notre plateforme.'
            : 'Su jafe walla xeet yu jafe am, jokkoo ci autorités walla jëfandikoo platform bi ci gaaw.'}
        </p>
      </section>

      {/* Bouton retour */}
      <button
        onClick={() => onPageChange('home')}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {language === 'fr' ? '⬅ Retour à l’accueil' : '⬅ Dellu ci xët wu njëkk'}
      </button>
    </div>
  );
};
