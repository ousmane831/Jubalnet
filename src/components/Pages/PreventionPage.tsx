import React, { useState } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Lock, 
  Smartphone, 
  CreditCard,
  Users,
  Home,
  Car,
  Globe,
  Phone,
  BookOpen,
  Download,
  Play,
  ExternalLink,
  ChevronRight,
  CheckCircle
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface PreventionPageProps {
  onPageChange: (page: string) => void;
}

export const PreventionPage: React.FC<PreventionPageProps> = ({ onPageChange }) => {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('cybercrime');
  const [expandedTip, setExpandedTip] = useState<string | null>(null);

  const preventionCategories = [
    {
      id: 'harassment',
      name: language === 'fr' ? 'Harcèlement' : 'Harcèlement',
      icon: Users,
      color: 'red',
      description: language === 'fr' 
        ? 'Prévention du harcèlement moral et sexuel'
        : 'Yëgle harcèlement moral ak sexual'
    },
    {
      id: 'identity_theft',
      name: language === 'fr' ? 'Usurpation d\'identité' : 'Fekkante identité',
      icon: Shield,
      color: 'blue',
      description: language === 'fr' 
        ? 'Protection contre le vol d\'identité et fraudes'
        : 'Jëkk ci sàcc identité ak njoloor'
    },
    {
      id: 'money_laundering',
      name: language === 'fr' ? 'Blanchiment de capitaux' : 'Blanchiment bu xaalis',
      icon: AlertTriangle,
      color: 'red',
      description: language === 'fr' 
        ? 'Prévention du blanchiment d\'argent et financement illégal'
        : 'Yëgle blanchiment bu xaalis ak financement bu dëggu'
    },
    {
      id: 'corruption',
      name: language === 'fr' ? 'Corruption' : 'Sëpp',
      icon: AlertTriangle,
      color: 'red',
      description: language === 'fr' 
        ? 'Reconnaître et signaler les actes de corruption'
        : 'Xam ak baxal jëf yu sëpp'
    },
    {
      id: 'theft',
      name: language === 'fr' ? 'Vol et Cambriolage' : 'Sàcc ak Këru Kër',
      icon: Home,
      color: 'orange',
      description: language === 'fr' 
        ? 'Sécuriser votre domicile et vos biens'
        : 'Jëkk sa kër ak sa alal yi'
    },
    {
      id: 'violence',
      name: language === 'fr' ? 'Violence et Agression' : 'Fit ak Njëbul',
      icon: Users,
      color: 'purple',
      description: language === 'fr' 
        ? 'Prévention des violences et protection des victimes'
        : 'Yëgle fit ak jëkk nit ñi ci am'
    }
  ];

  const preventionContent = {
    harassment: {
      tips: [
        {
          title: language === 'fr' ? 'Reconnaître le harcèlement' : 'Xam harcèlement bi',
          content: language === 'fr' 
            ? 'Comportements répétés, intimidation, menaces, commentaires déplacés, isolement.'
            : 'Jëf yu dellu-dellu, xeex, menaces, wax yu bon, isolation.',
          icon: AlertTriangle
        },
        {
          title: language === 'fr' ? 'Comment réagir' : 'Na ngeen jëf',
          content: language === 'fr' 
            ? 'Documentez les incidents, parlez-en à quelqu\'un de confiance, signalez aux autorités.'
            : 'Bind xeey yi, wax ak kenn nga yàgg, baxal ci autorités yi.',
          icon: Shield
        },
        {
          title: language === 'fr' ? 'Soutien disponible' : 'Ndimbalante am',
          content: language === 'fr' 
            ? 'Lignes d\'écoute, associations, services juridiques, accompagnement psychologique.'
            : 'Ligne yu déggal, associations, services juridiques, ndimbalante psychologique.',
          icon: Users
        }
      ],
      resources: [
        { title: 'Guide Anti-Harcèlement PDF', type: 'pdf', size: '2.1 MB' },
        { title: 'Vidéo: Que faire face au harcèlement', type: 'video', duration: '6:45' },
        { title: 'Numéros d\'aide', type: 'contacts', items: 8 }
      ]
    },
    identity_theft: {
      tips: [
        {
          title: language === 'fr' ? 'Protéger ses documents' : 'Jëkk sa dokimaan yi',
          content: language === 'fr' 
            ? 'Ne laissez jamais vos papiers d\'identité sans surveillance. Photocopiez-les et gardez les originaux en sécurité.'
            : 'Joxe kenn sa dokimaan yi ci benn bër. Def copies yi te dëkk originaux yi ci sécurité.',
          icon: Shield
        },
        {
          title: language === 'fr' ? 'Vigilance en ligne' : 'Tàngal ci internet',
          content: language === 'fr' 
            ? 'Ne partagez jamais vos informations personnelles sur les réseaux sociaux ou sites non sécurisés.'
            : 'Joxe kenn sa xibaar yu kenn ci réseaux sociaux walla sites yu amul sécurité.',
          icon: Eye
        },
        {
          title: language === 'fr' ? 'Signaler rapidement' : 'Baxal ci gaaw',
          content: language === 'fr' 
            ? 'En cas d\'usurpation, contactez immédiatement la police et vos banques.'
            : 'Su fekkee usurpation, jokkoo police ak sa banques yi ci gaaw.',
          icon: Phone
        }
      ],
      resources: [
        { title: 'Guide Protection Identité', type: 'pdf', size: '1.8 MB' },
        { title: 'Démarches en cas de vol', type: 'checklist', items: 10 },
        { title: 'Contacts Urgents', type: 'contacts', items: 6 }
      ]
    },
    money_laundering: {
      tips: [
        {
          title: language === 'fr' ? 'Reconnaître le blanchiment' : 'Xam blanchiment bi',
          content: language === 'fr' 
            ? 'Transactions suspectes, montants inhabituels, sources de revenus floues.'
            : 'Transaction yu jafe, xaalis yu dëggu, sources revenus yu jafe.',
          icon: AlertTriangle
        },
        {
          title: language === 'fr' ? 'Signaler les activités suspectes' : 'Baxal jëf yu jafe',
          content: language === 'fr' 
            ? 'Contactez les autorités financières ou utilisez notre plateforme pour signaler.'
            : 'Jokkoo autorités yu xaalis walla jëfandikoo nun la platform bi ngir baxal.',
          icon: Shield
        },
        {
          title: language === 'fr' ? 'Protection personnelle' : 'Jëkk sa bopp',
          content: language === 'fr' 
            ? 'Ne participez jamais à des transactions douteuses, même si on vous propose de l\'argent.'
            : 'Joxe kenn bokk ci transaction yu jafe, ndax su la leen xaalis.',
          icon: Users
        }
      ],
      resources: [
        { title: 'Guide Anti-Blanchiment', type: 'pdf', size: '2.3 MB' },
        { title: 'Signaux d\'alerte', type: 'checklist', items: 12 },
        { title: 'Contacts CENTIF', type: 'contacts', items: 4 }
      ]
    },
    corruption: {
      tips: [
        {
          title: language === 'fr' ? 'Reconnaître la corruption' : 'Xam sëpp bi',
          content: language === 'fr' 
            ? 'Demande d\'argent pour un service public, favoritisme, détournement de fonds.'
            : 'Laaj xaalis ngir service bu reew mi, favoritisme, feek xaalis yu reew mi.',
          icon: AlertTriangle
        },
        {
          title: language === 'fr' ? 'Vos droits' : 'Sa jëf',
          content: language === 'fr' 
            ? 'Vous avez le droit de refuser de payer des pots-de-vin. Les services publics sont gratuits.'
            : 'Am nga jëf u nees fey pot-de-vin. Services yu reew mi ñu ngi ligeey.'
          ,
          icon: Shield
        },
        {
          title: language === 'fr' ? 'Comment signaler' : 'Na ngeen baxal',
          content: language === 'fr' 
            ? 'Utilisez notre plateforme ou la ligne verte anti-corruption: 800 00 80 80'
            : 'Jëfandikoo nun la platform bi walla ligne verte anti-corruption: 800 00 80 80',
          icon: Phone
        }
      ],
      resources: [
        { title: 'Loi Anti-Corruption', type: 'pdf', size: '1.8 MB' },
        { title: 'Numéros utiles', type: 'contacts', items: 8 },
        { title: 'Témoignages', type: 'video', duration: '8:15' }
      ]
    },
    theft: {
      tips: [
        {
          title: language === 'fr' ? 'Sécuriser son domicile' : 'Jëkk sa kër',
          content: language === 'fr' 
            ? 'Installez des serrures solides, éclairage extérieur et système d\'alarme si possible.'
            : 'Doxal serrures yu gëna, éclairage bu bëj kër gi ak système d\'alarme su mën.',
          icon: Home
        },
        {
          title: language === 'fr' ? 'En déplacement' : 'Bu dem',
          content: language === 'fr' 
            ? 'Ne montrez pas vos objets de valeur. Restez vigilant dans les transports en commun.'
            : 'Wontu sa alal yu bari. Tàngal ci transport en commun.',
          icon: Car
        },
        {
          title: language === 'fr' ? 'Téléphone portable' : 'Téléphone portable',
          content: language === 'fr' 
            ? 'Notez votre numéro IMEI. Activez le verrouillage automatique et la géolocalisation.'
            : 'Bind sa nimero IMEI. Doxal verrouillage otomatik ak géolocalisation.',
          icon: Smartphone
        }
      ],
      resources: [
        { title: 'Guide Sécurité Domicile', type: 'pdf', size: '3.1 MB' },
        { title: 'Checklist Voyage', type: 'checklist', items: 15 },
        { title: 'Assurance Habitation', type: 'info', pages: 4 }
      ]
    },
    violence: {
      tips: [
        {
          title: language === 'fr' ? 'Signaux d\'alarme' : 'Signaux d\'alarme',
          content: language === 'fr' 
            ? 'Menaces, isolement, contrôle excessif, violence physique ou psychologique.'
            : 'Menaces, isolation, contrôle bu bari, fit ci yaram walla ci xel.',
          icon: AlertTriangle
        },
        {
          title: language === 'fr' ? 'Demander de l\'aide' : 'Laaj ndimbalante',
          content: language === 'fr' 
            ? 'Contactez le 3919 (violences femmes), police (17) ou nos services confidentiels.'
            : 'Jokkoo 3919 (fit ci jigéen yi), police (17) walla nun la services yu sutura.',
          icon: Phone
        },
        {
          title: language === 'fr' ? 'Soutenir une victime' : 'Dimbalante ab victim',
          content: language === 'fr' 
            ? 'Écoutez sans juger, encouragez à chercher de l\'aide professionnelle.'
            : 'Déggal bu amul jugement, yàgg ko ngir wut ndimbalante bu professionnel.',
          icon: Users
        }
      ],
      resources: [
        { title: 'Guide Violences Conjugales', type: 'pdf', size: '2.7 MB' },
        { title: 'Centres d\'Accueil', type: 'contacts', items: 12 },
        { title: 'Aide Psychologique', type: 'info', pages: 6 }
      ]
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      red: 'bg-red-100 text-red-700 border-red-200',
      orange: 'bg-orange-100 text-orange-700 border-orange-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      green: 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <Download className="h-4 w-4" />;
      case 'video': return <Play className="h-4 w-4" />;
      case 'checklist': return <CheckCircle className="h-4 w-4" />;
      case 'contacts': return <Phone className="h-4 w-4" />;
      case 'form': return <ExternalLink className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const currentCategory = preventionCategories.find(cat => cat.id === selectedCategory);
  const currentContent = preventionContent[selectedCategory as keyof typeof preventionContent];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-br from-green-600 to-green-700 p-4 rounded-2xl shadow-lg inline-block mb-6">
            <Shield className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {language === 'fr' ? 'Prévention & Sensibilisation' : 'Yëgle ak Sensibilisation'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {language === 'fr' 
              ? 'Informez-vous et protégez-vous contre les différents types de crimes. La prévention est votre meilleure défense.'
              : 'Xibaar ak jëkk sa bopp ci mbind njub yi. Yëgle mooy sa défense bu gën.'
            }
          </p>
        </div>

        {/* Category Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {language === 'fr' ? 'Choisissez un domaine' : 'Tànn ab domaine'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {preventionCategories.map((category) => {
              const IconComponent = category.icon;
              const isSelected = selectedCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    isSelected 
                      ? `${getColorClasses(category.color)} border-current shadow-lg transform scale-105`
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <IconComponent className={`h-8 w-8 mb-3 ${
                    isSelected ? 'text-current' : 'text-gray-400'
                  }`} />
                  <h3 className={`font-semibold mb-2 ${
                    isSelected ? 'text-current' : 'text-gray-900'
                  }`}>
                    {category.name}
                  </h3>
                  <p className={`text-sm ${
                    isSelected ? 'text-current opacity-80' : 'text-gray-600'
                  }`}>
                    {category.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Category Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                {currentCategory && (
                  <>
                    <div className={`p-3 rounded-xl ${getColorClasses(currentCategory.color)}`}>
                      <currentCategory.icon className="h-8 w-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{currentCategory.name}</h2>
                      <p className="text-gray-600">{currentCategory.description}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Prevention Tips */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {language === 'fr' ? 'Conseils de Prévention' : 'Tànneef yu Yëgle'}
              </h3>
              <div className="space-y-4">
                {currentContent?.tips.map((tip, index) => {
                  const IconComponent = tip.icon;
                  const isExpanded = expandedTip === `${selectedCategory}-${index}`;
                  
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedTip(isExpanded ? null : `${selectedCategory}-${index}`)}
                        className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <IconComponent className="h-5 w-5 text-blue-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900">{tip.title}</h4>
                          </div>
                          <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          }`} />
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-4">
                          <p className="text-gray-700 leading-relaxed pl-12">{tip.content}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Emergency Actions */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">
                🚨 {language === 'fr' ? 'En cas d\'urgence' : 'Su fekkee caxaan'}
              </h3>
              <p className="text-red-100 mb-4">
                {language === 'fr' 
                  ? 'Si vous êtes victime ou témoin d\'un crime, agissez rapidement'
                  : 'Su fekkee nga victim walla témoin ab njub, jëf ci gaaw'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => window.location.href = 'tel:17'}
                  className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Phone className="h-4 w-4" />
                  <span>17 - Police</span>
                </button>
                <button
                  onClick={() => onPageChange('report')}
                  className="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  {language === 'fr' ? 'Signaler maintenant' : 'Baxal leegi'}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resources */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {language === 'fr' ? 'Lois et Article' : 'Lois ak Article'}
              </h3>
              <div className="space-y-3">
                {currentContent?.resources.map((resource, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded">
                        {getResourceIcon(resource.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{resource.title}</p>
                        <p className="text-xs text-gray-500">
                          {resource.size && `${resource.size}`}
                          {resource.duration && `${resource.duration}`}
                          {resource.items && `${resource.items} ${language === 'fr' ? 'éléments' : 'alal'}`}
                          {resource.pages && `${resource.pages} ${language === 'fr' ? 'pages' : 'pages'}`}
                          {resource.steps && `${resource.steps} ${language === 'fr' ? 'étapes' : 'étapes'}`}
                          {resource.fields && `${resource.fields} ${language === 'fr' ? 'champs' : 'champs'}`}
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {language === 'fr' ? 'Actions Rapides' : 'Jëf yu Gaaw'}
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => onPageChange('report')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>{language === 'fr' ? 'Signaler un crime' : 'Baxal ab njub'}</span>
                </button>
                <button
                  onClick={() => onPageChange('emergency')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Phone className="h-4 w-4" />
                  <span>{language === 'fr' ? 'Contacts d\'urgence' : 'Jokkoo yu caxaan'}</span>
                </button>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>{language === 'fr' ? 'Guide complet PDF' : 'Guide bu moom PDF'}</span>
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">
                📊 {language === 'fr' ? 'Impact de la Prévention' : 'Impact bu Yëgle'}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-green-100">{language === 'fr' ? 'Crimes évités' : 'Njub yi yëgle'}</span>
                  <span className="font-bold">-23%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-100">{language === 'fr' ? 'Citoyens sensibilisés' : 'Nit ñi sensibilisé'}</span>
                  <span className="font-bold">45,892</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-100">{language === 'fr' ? 'Guides téléchargés' : 'Guide yi télécharger'}</span>
                  <span className="font-bold">12,456</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'fr' ? 'Restez Informé' : 'Dëkk ci Xibaar'}
          </h3>
          <p className="text-gray-600 mb-6">
            {language === 'fr' 
              ? 'Recevez nos conseils de sécurité et alertes importantes par email'
              : 'Am nun la tànneef yu sécurité ak alertes yu am solo ci email'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder={language === 'fr' ? 'Votre adresse email' : 'Sa adresse email'}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              {language === 'fr' ? 'S\'abonner' : 'Abonner'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};