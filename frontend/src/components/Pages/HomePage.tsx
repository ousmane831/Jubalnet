import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Shield, 
  Phone, 
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  ArrowRight,
  Lock,
  Map,
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
// import hero1 from "../../assets/crime3.jpg";
// import hero2 from "../../assets/crime.jpg";
// import hero3 from "../../assets/crime1.jpg"; 
// import hero4 from "../../assets/crime2.jpg";
// import hero5 from "../../assets/crime4.jpg";
// import hero6 from "../../assets/crime5.jpg";

// import logo from "../../assets/jubbalnet3.png";
import CrimeMap from './CrimeMap';


interface HomePageProps {
  onPageChange: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onPageChange }) => {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [statistics, setStatistics] = useState({
    total_reports: 0,
    resolved_reports: 0,
    in_progress_reports: 0,
    total_users: 0,
  });


// // --- HERO SLIDER LOGIC ---
//   const images = [ hero1, hero2, hero3, hero4, hero5, hero6 ];
//   const [current, setCurrent] = useState(0);

// useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrent((prev) => (prev + 1) % images.length);
//     }, 2000);
//     return () => clearInterval(interval);
//   }, [images.length]);


  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const data = await apiService.getStatistics();
        setStatistics(data);
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    };
    
    loadStatistics();
  }, []);

  const stats = [
    { 
      icon: FileText, 
      value: statistics.total_reports.toLocaleString(), 
      label: t('home.statistics.total_reports'),
      color: 'text-blue-600'
    },
    { 
      icon: CheckCircle, 
      value: statistics.resolved_reports.toLocaleString(), 
      label: t('home.statistics.resolved'),
      color: 'text-green-600'
    },
    { 
      icon: Clock, 
      value: statistics.in_progress_reports.toLocaleString(), 
      label: t('home.statistics.in_progress'),
      color: 'text-orange-600'
    },
    { 
      icon: Users, 
      value: statistics.total_users.toLocaleString(),
      label: language === 'fr' ? 'Citoyens Engagés' : 'Nit ñu Boole',
      color: 'text-purple-600'
    },
  ];

  const quickActions = [
    {
      id: 'report',
      title: t('home.report_crime'),
      description: language === 'fr' 
        ? 'Signalez un crime ou un incident en toute confidentialité'
        : 'yëgle yëgal krim mbaa insidan ci kumpa bu mat sëkk',
      icon: FileText,
      gradient: 'from-red-500 to-red-600',
      urgent: true
    },
    {
      id: 'my-reports',
      title: t('home.view_reports'),
      description: language === 'fr' 
        ? 'Suivez l\'évolution de vos signalements'
        : 'Toppal ni say rapoor di doxee',
      icon: TrendingUp,
      gradient: 'from-blue-500 to-blue-600',
      requireAuth: true
    },
    {
      id: 'emergency',
      title: t('home.emergency_contacts'),
      description: language === 'fr' 
        ? 'Numéros d\'urgence et contacts officiels'
        : 'Nimero paj mu jamp ak jokkoo ofisel',
      icon: Phone,
      gradient: 'from-green-500 to-green-600'
    },
    {
      id: 'prevention',
      title: language === 'fr' ? 'Prévention' : 'fàggu',
      description: language === 'fr' 
        ? 'Informations et conseils de securite'
        : 'Leeral ak xelal ci wàllu kaaraange',
      icon: Shield,
      gradient: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
     
    <section className="bg-gradient-to-br from-green-600 via-green-700 to-yellow-600 text-white py-20">
            <div className="container mx-auto px-6">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-bold mb-6">
                  <span className="text-yellow-300">Jubbalnet</span>
                </h1>
                <p className="text-xl md:text-2xl mb-8 opacity-90">
                  Plateforme citoyenne de signalement des crimes au Sénégal
                </p>
                <p className="text-lg mb-12 opacity-80 max-w-2xl mx-auto">
                  Ensemble, construisons un Sénégal plus sûr en signalant les crimes et en prévenant la cybercriminalité
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => onPageChange('report')}
                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-6 h-6" />
                      <span>
                        {language === 'fr' ? 'Signalement d\'Urgence' : '🚨 Baxal bu Caxaan'}
                      </span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>

                  <button
                  onClick={() => onPageChange('plaint')}
                  className="border-2 border-white hover:bg-white hover:text-green-700 px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <div className="flex items-center space-x-2">
                    <Shield className="w-6 h-6" />
                    <span>
                      {language === 'fr' ? 'Plainte' : 'Jëf'}
                    </span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
                

                </div>
              </div>
            </div>
      </section>

      {/* Pourquoi Jubbalnet */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
           
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Pourquoi Jubbalnet ?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une plateforme innovante pour renforcer la sécurité au Sénégal
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-green-600 mb-4">
                <AlertTriangle className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Signalement facile</h3>
              <p className="text-gray-600">
                Interface simple et intuitive permettant aux citoyens de signaler rapidement tout type de crime, avec ou sans compte.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-blue-600 mb-4">
                <Shield className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Protection des données</h3>
              <p className="text-gray-600">
                Respect total de l'anonymat et protection des données personnelles selon les standards internationaux.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-yellow-600 mb-4">
                <Users className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Collaboration efficace</h3>
              <p className="text-gray-600">
                Connexion directe entre citoyens et autorités pour un traitement rapide des signalements.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-red-600 mb-4">
                <BarChart3 className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Statistiques transparentes</h3>
              <p className="text-gray-600">
                Suivi en temps réel des crimes et analyse des tendances pour une meilleure prévention.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-purple-600 mb-4">
                <Map className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Cartographie interactive</h3>
              <p className="text-gray-600">
                Visualisation géographique des crimes pour identifier les zones à risque au Sénégal.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-indigo-600 mb-4">
                <Phone className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Urgences accessibles</h3>
              <p className="text-gray-600">
                Accès rapide aux numéros d'urgence et commissariats de toutes les régions du Sénégal.
              </p>
            </div>
          </div>
        </div>
</section>

      {/* Statistics Section */}
      <div className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('home.statistics.title')}
            </h2>
            <p className="text-lg text-gray-600">
              {language === 'fr' 
                ? 'Impact de notre plateforme dans la lutte contre la criminalité'
                : 'Impact bu platform bi ci xool njub yi'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${stat.color.replace('text', 'bg').replace('600', '100')}`}>
                      <IconComponent className={`h-8 w-8 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section Carte Dynamique */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Carte des crimes par région</h2>
        <CrimeMap />
      </section>

      {/* Quick Actions */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {language === 'fr' ? 'Actions Rapides' : 'Jëf yu Gaaw'}
            </h2>
            <p className="text-lg text-gray-600">
              {language === 'fr' 
                ? 'Choisissez l\'action qui correspond à vos besoins'
                : 'Tànn jëf bi moom sa soxla'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              const isDisabled = action.requireAuth && !isAuthenticated;
              
              return (
                <div
                  key={action.id}
                  className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 ${
                    isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  onClick={() => !isDisabled && onPageChange(action.id)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-90`}></div>
                  <div className="relative p-6 text-white">
                    {action.urgent && (
                      <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                        URGENT
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <IconComponent className="h-12 w-12" />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">{action.title}</h3>
                    <p className="text-white/90 text-sm leading-relaxed mb-4">
                      {action.description}
                    </p>
                    
                    {isDisabled ? (
                      <div className="flex items-center text-white/80 text-sm">
                        <Lock className="h-4 w-4 mr-2" />
                        <span>{language === 'fr' ? 'Connexion requise' : 'Connexion wuute'}</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-white group-hover:translate-x-2 transition-transform">
                        <span className="text-sm font-medium mr-2">
                          {language === 'fr' ? 'Accéder' : 'Dugg'}
                        </span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-gray-50 py-12 border-t">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Lock className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'fr' ? 'Sécurité & Confidentialité Garanties' : 'Sécurité ak Sutura Garantir'}
          </h3>
          <p className="text-lg text-gray-600 leading-relaxed">
            {language === 'fr' 
              ? 'Vos informations sont protégées par un chiffrement de niveau militaire. L\'anonymat est respecté et votre sécurité est notre priorité absolue.'
              : 'Sa xibaar yi ñu ngi koo jëkk ak chiffrement bu sedd bu militaire. Anonymat bi ñu ngi ko saraxal te sa sécurité mooy nun la gën a ànd.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};