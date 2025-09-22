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
  AlertCircle,
  Lock
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import hero1 from "../../assets/crime3.jpg";
import hero2 from "../../assets/crime.jpg";
import hero3 from "../../assets/crime1.jpg"; 
import hero4 from "../../assets/crime2.jpg";
import hero5 from "../../assets/crime4.jpg";
import hero6 from "../../assets/crime5.jpg";

import logo from "../../assets/jubbalnet3.png";


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


// --- HERO SLIDER LOGIC ---
  const images = [ hero1, hero2, hero3, hero4, hero5, hero6 ];
  const [current, setCurrent] = useState(0);

useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [images.length]);


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
     
{/* HERO SECTION */}
<div className="relative h-[600px] overflow-hidden">
  {images.map((img, index) => (
    <div
      key={index}
      className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
        index === current ? "opacity-100" : "opacity-0"
      }`}
      style={{ backgroundImage: `url(${img})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10"></div>
    </div>
  ))}

  {/* Ton contenu central */}
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
    <div className="flex justify-center mb-6">
      <div className="flex items-center space-x-3">
          <img 
            src={logo} 
            alt="logo_jubbalnet" 
            className="h-40 w-40 object-contain" // 👈 taille fixe, s’adapte bien
          />
        </div>
    </div>

    <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
      <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
        {t('home.title')}
      </span>
    </h1>

    <p className="text-xl lg:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed">
      {t('home.subtitle')}
    </p>

    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        onClick={() => onPageChange('report')}
        className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
      >
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span>
            {language === 'fr' ? '🚨 Signalement d\'Urgence' : '🚨 Baxal bu Caxaan'}
          </span>
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </div>
      </button>
    </div>
  </div>

  {/* Indicateurs (petits ronds en bas) */}
  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
    {images.map((_, index) => (
      <button
        key={index}
        className={`w-3 h-3 rounded-full transition-all ${
          index === current ? "bg-white scale-110" : "bg-white/50"
        }`}
        onClick={() => setCurrent(index)}
      ></button>
    ))}
  </div>
</div>

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