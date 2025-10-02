import React, { useState } from 'react';
import { Phone, MapPin, Clock, AlertTriangle, Shield, Users, Copy, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { emergencyContacts } from '../../data/mockData';

interface EmergencyPageProps {
  onPageChange: (page: string) => void;
}

export const EmergencyPage: React.FC<EmergencyPageProps> = ({ onPageChange }) => {
  const { language, t } = useLanguage();
  const [copiedNumber, setCopiedNumber] = useState<string>('');

  const copyToClipboard = (number: string) => {
    navigator.clipboard.writeText(number);
    setCopiedNumber(number);
    setTimeout(() => setCopiedNumber(''), 2000);
  };

  const callNumber = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  const emergencyTips = [
    {
      icon: AlertTriangle,
      title: language === 'fr' ? 'En cas d\'urgence immédiate' : 'Su fekkee caxaan',
      content: language === 'fr' 
        ? 'Composez le 17 pour la police ou le 18 pour les pompiers. Restez calme et donnez votre localisation précise.'
        : 'Wëñal 17 ngir police walla 18 ngir pompiers. Nees te wax sa bër bu baax.',
      color: 'red'
    },
    {
      icon: Shield,
      title: language === 'fr' ? 'Votre sécurité d\'abord' : 'Sa sécurité ak njëkk',
      content: language === 'fr'
        ? 'Si vous êtes en danger, éloignez-vous de la situation avant d\'appeler les secours.'
        : 'Su fekkee ci xeey, gen ci benn bër bu sécurisé balaa ma wëñal ndimbalante.',
      color: 'blue'
    },
    {
      icon: Users,
      title: language === 'fr' ? 'Témoins importants' : 'Témoin yu am solo',
      content: language === 'fr'
        ? 'Notez les informations importantes : heure, lieu, description des personnes impliquées.'
        : 'Bind xibaar yu am solo: waxtu, bër, description nit yi ci feeñ.',
      color: 'green'
    }
  ];

  const regions = [
    { name: 'Dakar', phone: '+221 33 842 33 41' },
    { name: 'Thiès', phone: '+221 33 939 58 48' },
    { name: 'Saint-Louis', phone: '+221 33 961 10 25' },
    { name: 'Kaolack', phone: '+221 33 941 12 90' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-red-100 p-4 rounded-2xl inline-block mb-4">
            <Phone className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('nav.emergency')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'fr' 
              ? 'Accès rapide aux services d\'urgence et contacts des autorités compétentes'
              : 'Dugg ci gaaw ci services yu caxaan ak jokkoo autorités yu am xam-xam'
            }
          </p>
        </div>

        {/* Emergency Alert */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 mb-8 text-white shadow-xl">
          <div className="flex items-start space-x-4">
            <div className="bg-white/20 p-3 rounded-full animate-pulse">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">
                🚨 {language === 'fr' ? 'URGENCE' : 'CAXAAN'}
              </h2>
              <p className="text-white/90 text-lg mb-4">
                {language === 'fr' 
                  ? 'En cas d\'urgence vitale, composez immédiatement le 17 (Police) ou 18 (Pompiers)'
                  : 'Su fekkee caxaan bu bëgg dundee, wëñal gii léegi 17 (Police) walla 18 (Pompiers)'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => callNumber('17')}
                  className="bg-white text-red-600 px-6 py-3 rounded-lg font-bold hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Phone className="h-5 w-5" />
                  <span>📞 17 - Police</span>
                </button>
                <button
                  onClick={() => callNumber('18')}
                  className="bg-white text-red-600 px-6 py-3 rounded-lg font-bold hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Phone className="h-5 w-5" />
                  <span>🚒 18 - Pompiers</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Tips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {emergencyTips.map((tip, index) => {
            const IconComponent = tip.icon;
            const colorClasses = {
              red: 'bg-red-50 border-red-200 text-red-800',
              blue: 'bg-blue-50 border-blue-200 text-blue-800',
              green: 'bg-green-50 border-green-200 text-green-800'
            };
            
            return (
              <div key={index} className={`rounded-xl p-6 border-2 ${colorClasses[tip.color as keyof typeof colorClasses]}`}>
                <div className="flex items-center space-x-3 mb-3">
                  <IconComponent className="h-6 w-6" />
                  <h3 className="font-semibold">{tip.title}</h3>
                </div>
                <p className="text-sm leading-relaxed">{tip.content}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Emergency Contacts */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Phone className="h-6 w-6 mr-2 text-blue-600" />
              {language === 'fr' ? 'Contacts d\'Urgence Nationaux' : 'Jokkoo yu Caxaan yu Réew mi'}
            </h3>
            
            <div className="space-y-4">
              {emergencyContacts.map((contact) => (
                <div key={contact.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {language === 'fr' ? contact.name_fr : contact.name_wo}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {language === 'fr' ? contact.description_fr : contact.description_wo}
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                          {contact.department.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col space-y-2">
                      <button
                        onClick={() => callNumber(contact.phone_number)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-1"
                      >
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">{contact.phone_number}</span>
                      </button>
                      <button
                        onClick={() => copyToClipboard(contact.phone_number)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-1"
                      >
                        {copiedNumber === contact.phone_number ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{language === 'fr' ? 'Copié!' : 'Kopie!'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            <span className="text-sm">{language === 'fr' ? 'Copier' : 'Kopie'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Contacts */}
          <div className="space-y-6">
            {/* Quick Report */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-6 w-6 mr-2 text-orange-600" />
                {language === 'fr' ? 'Signalement Rapide' : 'Baxal bu Gaaw'}
              </h3>
              <p className="text-gray-600 mb-4">
                {language === 'fr' 
                  ? 'Pour un signalement non urgent, utilisez notre plateforme sécurisée.'
                  : 'Ngir baxal bu amul caxaan, jëfandikoo nun la platform bu sécurisé.'
                }
              </p>
              <button
                onClick={() => onPageChange('report')}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {language === 'fr' ? '📝 Faire un Signalement' : '📝 Def ab Baxal'}
              </button>
            </div>

            {/* Regional Police */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-6 w-6 mr-2 text-purple-600" />
                {language === 'fr' ? 'Contacts Régionaux' : 'Jokkoo yu Réegion'}
              </h3>
              
              <div className="space-y-3">
                {regions.map((region, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{region.name}</p>
                      <p className="text-sm text-gray-600">
                        {language === 'fr' ? 'Commissariat Central' : 'Commissariat Central'}
                      </p>
                      <p className="font-medium text-gray-900">{region.phone}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => callNumber(region.phone)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                      >
                        <Phone className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(region.phone)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SMS Service */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-3 flex items-center">
                💬 {language === 'fr' ? 'Service SMS' : 'Service SMS'}
              </h3>
              <p className="text-green-100 mb-4 text-sm">
                {language === 'fr' 
                  ? 'Envoyez vos signalements par SMS au numéro court ci-dessous'
                  : 'Yónnee sa baxal yi ci SMS ci nimero yu gagg yi'
                }
              </p>
              <div className="bg-white/20 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold">📱 1234</p>
                <p className="text-xs text-green-100 mt-1">
                  {language === 'fr' ? 'Numéro court gratuit' : 'Nimero gagg bu ligeey'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-start space-x-4">
            <div className="bg-amber-100 p-2 rounded-full">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-800 mb-2">
                {language === 'fr' ? 'Informations Importantes' : 'Xibaar yu am Solo'}
              </h3>
              <ul className="text-sm text-amber-700 space-y-2">
                <li>• {language === 'fr' ? 'Les services d\'urgence sont disponibles 24h/24 et 7j/7' : 'Services yu caxaan ñu ngi ligeey 24h/24 ak 7j/7'}</li>
                <li>• {language === 'fr' ? 'En cas de faux appel, des sanctions légales peuvent s\'appliquer' : 'Su wëñal bu wóor, sanction yu loi yi mën nañu am'}</li>
                <li>• {language === 'fr' ? 'Gardez toujours ces numéros à portée de main' : 'Dëkk nimero yi ci benn bër ngir gëna ko jëfandikoo'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};