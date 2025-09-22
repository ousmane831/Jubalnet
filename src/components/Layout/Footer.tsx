import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import logo from "../../assets/jubbalnet1.png";

interface FooterProps {
  onPageChange: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onPageChange }) => {
  const { language } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src={logo} 
                alt="logo_jubbalnet" 
                className="h-44 w-44 object-contain" 
              />
              <span className="hidden sm:inline text-xl font-bold text-white-800">Jubbalnet</span>
            </div>
            <p className="text-gray-300 mb-4">
              {language === 'fr' 
                ? 'Une initiative du gouvernement sénégalais pour lutter contre la criminalité et promouvoir la sécurité de tous les citoyens.'
                : 'Ab initiative bu gouvernement bu Senegaal ngir xoolal njub yi ak xeex sécurité bu nit ku nekk ñepp.'}
            </p>
            <div className="flex space-x-4">
              <a 
                href="tel:17" 
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                🚨 {language === 'fr' ? 'Urgence: 17' : 'Caxaan: 17'}
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {language === 'fr' ? 'Liens Rapides' : 'Liens yu Gaaw'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onPageChange('report')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {language === 'fr' ? 'Comment Signaler' : 'Na Ngeen Baxal'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onPageChange('vos-droits')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {language === 'fr' ? 'Vos Droits' : 'Sa Jëf'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onPageChange('confidentialite')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {language === 'fr' ? 'Confidentialité' : 'Sutura'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onPageChange('faq')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {language === 'fr' ? 'FAQ' : 'Laajum Laajum'}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {language === 'fr' ? 'Contact' : 'Jokkoo'}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <Phone className="h-4 w-4 mt-0.5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-300">+221 33 XXX XX XX</p>
                  <p className="text-xs text-gray-400">
                    {language === 'fr' ? 'Support technique' : 'Ndimbalante technique'}
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <Mail className="h-4 w-4 mt-0.5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-300">contact@denonciation.sn</p>
                  <p className="text-xs text-gray-400">
                    {language === 'fr' ? 'Informations générales' : 'Xibaar yu lokoo'}
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-300">
                    {language === 'fr' ? 'Dakar, Sénégal' : 'Ndakaaru, Senegaal'}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 {language === 'fr' ? 'République du Sénégal' : 'Réewum Senegaal'}. 
              {language === 'fr' ? ' Tous droits réservés.' : ' Jëf yépp ñu ko koo defar.'}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button
                onClick={() => onPageChange('confidentialite')}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                {language === 'fr' ? 'Politique de confidentialité' : 'Politique bu sutura'}
              </button>
              <button
                onClick={() => onPageChange('conditions')}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                {language === 'fr' ? 'Conditions d\'utilisation' : 'Sarax yu jëfandikoo'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
