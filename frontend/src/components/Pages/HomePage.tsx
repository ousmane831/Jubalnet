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
  BarChart3,
  Sparkles,
  Zap,
  Eye,
  Globe,
  Heart,
  Star
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
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
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    { 
      icon: CheckCircle, 
      value: statistics.resolved_reports.toLocaleString(), 
      label: t('home.statistics.resolved'),
      color: 'green',
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100'
    },
    { 
      icon: Clock, 
      value: statistics.in_progress_reports.toLocaleString(), 
      label: t('home.statistics.in_progress'),
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100'
    },
    { 
      icon: Users, 
      value: statistics.total_users.toLocaleString(),
      label: language === 'fr' ? 'Citoyens Engagés' : 'Nit ñu Boole',
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100'
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
      gradient: 'from-red-500 via-red-600 to-pink-600',
      bgGradient: 'from-red-50 to-pink-50',
      urgent: true
    },
    {
      id: 'my-reports',
      title: t('home.view_reports'),
      description: language === 'fr' 
        ? 'Suivez l\'évolution de vos signalements'
        : 'Toppal ni say rapoor di doxee',
      icon: TrendingUp,
      gradient: 'from-blue-500 via-blue-600 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      requireAuth: true
    },
    {
      id: 'emergency',
      title: t('home.emergency_contacts'),
      description: language === 'fr' 
        ? 'Numéros d\'urgence et contacts officiels'
        : 'Nimero paj mu jamp ak jokkoo ofisel',
      icon: Phone,
      gradient: 'from-green-500 via-green-600 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    {
      id: 'prevention',
      title: language === 'fr' ? 'Prévention' : 'fàggu',
      description: language === 'fr' 
        ? 'Informations et conseils de securite'
        : 'Leeral ak xelal ci wàllu kaaraange',
      icon: Shield,
      gradient: 'from-purple-500 via-purple-600 to-violet-600',
      bgGradient: 'from-purple-50 to-violet-50'
    }
  ];

  const features = [
    {
      icon: AlertTriangle,
      title: language === 'fr' ? 'Signalement facile' : 'Baxal fasil',
      description: language === 'fr' 
        ? 'Interface simple et intuitive permettant aux citoyens de signaler rapidement tout type de crime, avec ou sans compte.'
        : 'Interface bu fasil ak bu xamal nit ñi nañu baxal ci gaaw mbind njub yi, ak walla amul compte.',
      color: 'red',
      gradient: 'from-red-500 to-orange-500',
      bgGradient: 'from-red-50 to-orange-50'
    },
    {
      icon: Shield,
      title: language === 'fr' ? 'Protection des données' : 'Jëkk xibaar yi',
      description: language === 'fr' 
        ? 'Respect total de l\'anonymat et protection des données personnelles selon les standards internationaux.'
        : 'Saraxal anonymat bi te jëkk xibaar yu bopp yi selon standards yu international yi.',
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      icon: Users,
      title: language === 'fr' ? 'Collaboration efficace' : 'Collaboration bu baax',
      description: language === 'fr' 
        ? 'Connexion directe entre citoyens et autorités pour un traitement rapide des signalements.'
        : 'Jokkoo bu dëgg ci biir citoyens ak autorités ngir traitement bu gaaw ci baxal yi.',
      color: 'yellow',
      gradient: 'from-yellow-500 to-amber-500',
      bgGradient: 'from-yellow-50 to-amber-50'
    },
    {
      icon: BarChart3,
      title: language === 'fr' ? 'Statistiques transparentes' : 'Statistiques yu leer',
      description: language === 'fr' 
        ? 'Suivi en temps réel des crimes et analyse des tendances pour une meilleure prévention.'
        : 'Toppal ci temps réel njub yi ak analiz tendances yi ngir yëgle bu gën.',
      color: 'red',
      gradient: 'from-red-500 to-pink-500',
      bgGradient: 'from-red-50 to-pink-50'
    },
    {
      icon: Map,
      title: language === 'fr' ? 'Cartographie interactive' : 'Kartographie interactive',
      description: language === 'fr' 
        ? 'Visualisation géographique des crimes pour identifier les zones à risque au Sénégal.'
        : 'Wone ci géographique njub yi ngir xam zones yu risk ci Sénégal.',
      color: 'purple',
      gradient: 'from-purple-500 to-violet-500',
      bgGradient: 'from-purple-50 to-violet-50'
    },
    {
      icon: Phone,
      title: language === 'fr' ? 'Urgences accessibles' : 'Urgences yu yomb',
      description: language === 'fr' 
        ? 'Accès rapide aux numéros d\'urgence et commissariats de toutes les régions du Sénégal.'
        : 'Dugg ci gaaw ci numero yu caxaan ak commissariats yu réegion yépp ci Sénégal.',
      color: 'indigo',
      gradient: 'from-indigo-500 to-blue-500',
      bgGradient: 'from-indigo-50 to-blue-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* Hero Section avec design moderne */}
      <section className="relative overflow-hidden bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 text-white">
        {/* Pattern de fond */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Cercles décoratifs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/20 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400/20 rounded-full -ml-36 -mb-36"></div>
        
        <div className="relative container mx-auto px-4 py-6 sm:py-8 lg:py-10">

          <div className="text-center max-w-5xl mx-auto">
            {/* Logo/Badge */}
            <div className="flex justify-center mb-2">

              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-2xl">
                <Shield className="h-16 w-16 sm:h-20 sm:w-20 text-yellow-300" />
              </div>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                Jubbalnet
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl md:text-3xl mb-6 opacity-95 font-medium">
              {language === 'fr' 
                ? 'Plateforme citoyenne de signalement des crimes au Sénégal'
                : 'Platform bu citoyen ngir baxal njub yi ci Sénégal'
              }
            </p>
            
            <p className="text-lg sm:text-xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
              {language === 'fr' 
                ? 'Ensemble, construisons un Sénégal plus sûr en signalant les crimes et en prévenant la cybercriminalité'
                : 'Ci biir, sosal Sénégal bu gën a am sécurité ci baxal njub yi ak yëgle cybercriminalité bi'
              }
            </p>
            
            {/* Badges d'information */}
<div className="flex flex-wrap justify-center gap-3 mb-6">
  <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full flex items-center space-x-2">
    <Sparkles className="h-5 w-5" />
    <span className="font-semibold">{language === 'fr' ? '100% Gratuit' : '100% Bés'}</span>
  </div>
  <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full flex items-center space-x-2">
    <Lock className="h-5 w-5" />
    <span className="font-semibold">{language === 'fr' ? '100% Sécurisé' : '100% Jëkk'}</span>
  </div>
  <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full flex items-center space-x-2">
    <Eye className="h-5 w-5" />
    <span className="font-semibold">{language === 'fr' ? 'Anonyme' : 'Sutura'}</span>
  </div>
</div>

{/* Boutons d'action */}
<div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
  <button
    onClick={() => onPageChange('report')}
    className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-200 transform hover:scale-105 shadow-2xl hover:shadow-red-500/50 flex items-center justify-center space-x-3"
  >
    <AlertTriangle className="w-6 h-6" />
    <span>{language === 'fr' ? 'Signalement d\'Urgence' : '🚨 Baxal bu Caxaan'}</span>
    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
  </button>

  <button
    onClick={() => onPageChange('plaint')}
    className="group bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/50 hover:border-white text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-200 transform hover:scale-105 shadow-xl flex items-center justify-center space-x-3"
  >
    <Shield className="w-6 h-6" />
    <span>{language === 'fr' ? 'Déposer une Plainte' : 'Yónnee Plainte'}</span>
    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
  </button>
</div>

          </div>
        </div>
      </section>

      {/* Statistics Section - Design moderne */}
      <div className="bg-white py-16 border-b border-gray-100 -mt-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('home.statistics.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {language === 'fr' 
                ? 'Impact de notre plateforme dans la lutte contre la criminalité'
                : 'Impact bu platform bi ci xool njub yi'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden transform hover:-translate-y-2"
                >
                  {/* Gradient de fond au survol */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  
                  <div className="relative flex items-center space-x-4">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <p className="text-3xl sm:text-4xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                        {stat.value}
                      </p>
                      <p className="text-sm font-semibold text-gray-600 mt-1">{stat.label}</p>
                    </div>
                  </div>
                  
                  {/* Barre de progression décorative */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
                    <div 
                      className={`h-full bg-gradient-to-r ${stat.gradient} transition-all duration-1000`}
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pourquoi Jubbalnet - Design professionnel */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl">
                <Star className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              {language === 'fr' ? 'Pourquoi Jubbalnet ?' : 'Lu tax Jubbalnet ?'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'fr' 
                ? 'Une plateforme innovante pour renforcer la sécurité au Sénégal'
                : 'Ab platform bu yees ak bu sëkk ngir gën a jëkk sécurité ci Sénégal'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden transform hover:-translate-y-2"
                >
                  {/* Gradient de fond */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  
                  <div className="relative">
                    {/* Icône avec gradient */}
                    <div className={`mb-6 p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg w-fit group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-10 h-10" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed text-base group-hover:text-gray-700 transition-colors">
                      {feature.description}
                    </p>
                    
                    {/* Ligne décorative */}
                    <div className="mt-6 h-1 w-20 bg-gradient-to-r from-gray-200 to-transparent group-hover:from-gray-300 transition-colors"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section Carte Dynamique - Design amélioré */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-3 rounded-xl">
                <Map className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {language === 'fr' ? 'Carte des crimes par région' : 'Kart njub yi ci réegion'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {language === 'fr' 
                ? 'Visualisez la répartition géographique des signalements au Sénégal'
                : 'Wone répartition géographique baxal yi ci Sénégal'
              }
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <CrimeMap />
          </div>
        </div>
      </section>

      {/* Quick Actions - Design moderne */}
      <div className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                <Zap className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {language === 'fr' ? 'Actions Rapides' : 'Jëf yu Gaaw'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {language === 'fr' 
                ? 'Choisissez l\'action qui correspond à vos besoins'
                : 'Tànn jëf bi moom sa soxla'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              const isDisabled = action.requireAuth && !isAuthenticated;
              
              return (
                <div
                  key={action.id}
                  className={`group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                    isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  onClick={() => !isDisabled && onPageChange(action.id)}
                >
                  {/* Gradient de fond */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-95 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  
                  {/* Pattern de fond */}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v22H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z'/%3E%3C/g%3E%3C/svg%3E")`
                  }}></div>
                  
                  <div className="relative p-6 sm:p-8 text-white min-h-[280px] flex flex-col">
                    {action.urgent && (
                      <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse">
                        URGENT
                      </div>
                    )}
                    
                    <div className="mb-6">
                      <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl w-fit group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                        <IconComponent className="h-10 w-10 sm:h-12 sm:w-12" />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-yellow-200 transition-colors">
                      {action.title}
                    </h3>
                    
                    <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-6 flex-1">
                      {action.description}
                    </p>
                    
                    {isDisabled ? (
                      <div className="flex items-center text-white/80 text-sm bg-white/10 px-4 py-2 rounded-lg">
                        <Lock className="h-4 w-4 mr-2" />
                        <span>{language === 'fr' ? 'Connexion requise' : 'Connexion wuute'}</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-white font-semibold group-hover:text-yellow-200 transition-colors">
                        <span className="text-sm sm:text-base mr-2">
                          {language === 'fr' ? 'Accéder' : 'Dugg'}
                        </span>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Security Notice - Design moderne */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-16 relative overflow-hidden">
        {/* Pattern de fond */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-4 rounded-2xl shadow-2xl">
              <Lock className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            {language === 'fr' ? 'Sécurité & Confidentialité Garanties' : 'Sécurité ak Sutura Garantir'}
          </h3>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <p className="text-lg sm:text-xl text-gray-200 leading-relaxed mb-6">
              {language === 'fr' 
                ? 'Vos informations sont protégées par un chiffrement de niveau militaire. L\'anonymat est respecté et votre sécurité est notre priorité absolue.'
                : 'Sa xibaar yi ñu ngi koo jëkk ak chiffrement bu sedd bu militaire. Anonymat bi ñu ngi ko saraxal te sa sécurité mooy nun la gën a ànd.'
              }
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-white text-sm font-medium">{language === 'fr' ? 'Chiffrement SSL' : 'Chiffrement SSL'}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
                <Shield className="h-5 w-5 text-blue-400" />
                <span className="text-white text-sm font-medium">{language === 'fr' ? 'Anonymat garanti' : 'Anonymat garantir'}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
                <Lock className="h-5 w-5 text-purple-400" />
                <span className="text-white text-sm font-medium">{language === 'fr' ? 'Données sécurisées' : 'Données yu jëkk'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
