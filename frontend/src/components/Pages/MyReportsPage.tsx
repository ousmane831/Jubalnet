import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  Calendar,
  MapPin,
  User,
  Shield,
  Search,
  MessageCircle,
  Filter,
  Image as ImageIcon,
  File,
  Volume2,
  Download,
  ChevronRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import { CrimeReport } from '../../types';

interface MyReportsPageProps {
  onPageChange: (page: string) => void;
}

export const MyReportsPage: React.FC<MyReportsPageProps> = ({ onPageChange }) => {
  const { language, t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<CrimeReport | null>(null);
  const [reports, setReports] = useState<CrimeReport[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load user reports and categories
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [reportsData, categoriesData] = await Promise.all([
        apiService.getUserReports(),
        apiService.getCategories()
      ]);
      
      setReports(reportsData.results || reportsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12">
        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full text-center transform transition-all hover:scale-105">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-5 rounded-full inline-block mb-6 shadow-lg">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            {language === 'fr' ? 'Connexion Requise' : 'Connexion Wuute'}
          </h3>
          <p className="text-gray-600 mb-8 text-lg">
            {language === 'fr' 
              ? 'Vous devez être connecté pour voir vos signalements.'
              : 'Wara nga togg ngir gis sa baxal yi.'
            }
          </p>
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => onPageChange('auth')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {language === 'fr' ? 'Se Connecter' : 'Togg'}
            </button>
            <button
              onClick={() => onPageChange('home')}
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              {language === 'fr' ? 'Retour à l\'accueil' : 'Dellu ci accueil'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'reviewing': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'investigating': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'forwarded': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'closed': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <Clock className="h-4 w-4" />;
      case 'reviewing': return <Eye className="h-4 w-4" />;
      case 'investigating': return <AlertTriangle className="h-4 w-4" />;
      case 'forwarded': return <FileText className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusCounts = {
    all: reports.length,
    submitted: reports.filter(r => r.status === 'submitted').length,
    reviewing: reports.filter(r => r.status === 'reviewing').length,
    investigating: reports.filter(r => r.status === 'investigating').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
  };

  if (selectedReport) {
    const category = categories.find(c => c.id === selectedReport.category_id);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSelectedReport(null)}
            className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 font-semibold transition-colors group"
          >
            <ChevronRight className="h-5 w-5 mr-2 transform rotate-180 group-hover:-translate-x-1 transition-transform" />
            {language === 'fr' ? 'Retour à mes signalements' : 'Dellu ci sama baxal yi'}
          </button>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black opacity-5"></div>
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      {category && (
                        <div 
                          className="w-5 h-5 rounded-full shadow-lg"
                          style={{ backgroundColor: category.color }}
                        ></div>
                      )}
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(selectedReport.status)} bg-white/10 backdrop-blur-sm`}>
                        <span className="flex items-center gap-2">
                          {getStatusIcon(selectedReport.status)}
                          {t(`status.${selectedReport.status}`)}
                        </span>
                      </span>
                      {selectedReport.is_anonymous && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          {language === 'fr' ? 'Anonyme' : 'Sutura'}
                        </span>
                      )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">{selectedReport.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-blue-100">
                      <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                        <Calendar className="h-4 w-4" />
                        {new Date(selectedReport.created_at).toLocaleDateString('fr-FR', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </span>
                      <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                        <MapPin className="h-4 w-4" />
                        {selectedReport.location_text || selectedReport.region}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contenu principal */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Description */}
                  <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-indigo-600" />
                      {language === 'fr' ? 'Description' : 'Ñakk'}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {selectedReport.description}
                    </p>
                  </div>

                  {/* Détails de l'incident */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Activity className="h-5 w-5 text-indigo-600" />
                      {language === 'fr' ? 'Détails de l\'incident' : 'Détail yu xeey bi'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <span className="text-sm text-gray-600 block mb-1">{language === 'fr' ? 'Date de l\'incident' : 'Beesu xeey bi'}</span>
                        <span className="font-semibold text-gray-900">{selectedReport.incident_date}</span>
                      </div>
                      {selectedReport.incident_time && (
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <span className="text-sm text-gray-600 block mb-1">{language === 'fr' ? 'Heure' : 'Waxtu'}</span>
                          <span className="font-semibold text-gray-900">{selectedReport.incident_time}</span>
                        </div>
                      )}
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <span className="text-sm text-gray-600 block mb-1">{language === 'fr' ? 'Priorité' : 'Priorité'}</span>
                        <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold border ${getPriorityColor(selectedReport.priority)}`}>
                          {selectedReport.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Médias attachés */}
                  {selectedReport.media_files && selectedReport.media_files.length > 0 && (
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-indigo-600" />
                        {language === 'fr' ? 'Pièces jointes' : 'Jappante yi'}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedReport.media_files.map((media: any) => {
                          const isImage = media.file_name?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                          const isDocument = media.file_name?.match(/\.(pdf|doc|docx)$/i);
                          
                          return (
                            <a
                              key={media.id}
                              href={media.file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all"
                            >
                              {isImage ? (
                                <div className="flex flex-col items-center gap-2">
                                  <ImageIcon className="h-8 w-8 text-indigo-600" />
                                  <span className="text-xs text-gray-600 text-center truncate w-full">{media.file_name}</span>
                                </div>
                              ) : isDocument ? (
                                <div className="flex flex-col items-center gap-2">
                                  <File className="h-8 w-8 text-indigo-600" />
                                  <span className="text-xs text-gray-600 text-center truncate w-full">{media.file_name}</span>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-2">
                                  <Download className="h-8 w-8 text-indigo-600" />
                                  <span className="text-xs text-gray-600 text-center truncate w-full">{media.file_name}</span>
                                </div>
                              )}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Audio attaché */}
                  {selectedReport.voice_report && (
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Volume2 className="h-5 w-5 text-indigo-600" />
                        {language === 'fr' ? 'Rapport vocal' : 'Rapport ci baat'}
                      </h3>
                      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl">
                        <audio controls className="w-full">
                          <source src={selectedReport.voice_report.audio_file} type="audio/mpeg" />
                          {language === 'fr' ? 'Votre navigateur ne supporte pas la lecture audio.' : 'Navigateur bi du may la jàngal ci baat.'}
                        </audio>
                      </div>
                    </div>
                  )}

                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Catégorie */}
                  <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      {language === 'fr' ? 'Catégorie' : 'Mbind'}
                    </h3>
                    {category && (
                      <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200">
                        <div 
                          className="w-6 h-6 rounded-full shadow-md"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="font-semibold text-gray-900">
                          {language === 'fr' ? category.name_fr : category.name_wo}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Informations */}
                  <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      {language === 'fr' ? 'Informations' : 'Xibaar'}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200">
                        {selectedReport.is_anonymous ? (
                          <>
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <Shield className="h-5 w-5 text-blue-600" />
                            </div>
                            <span className="font-medium text-gray-900">{language === 'fr' ? 'Signalement anonyme' : 'Baxal bu sutura'}</span>
                          </>
                        ) : (
                          <>
                            <div className="bg-gray-100 p-2 rounded-lg">
                              <User className="h-5 w-5 text-gray-600" />
                            </div>
                            <span className="font-medium text-gray-900">{language === 'fr' ? 'Signalement identifié' : 'Baxal bu identifié'}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200">
                        <div className="bg-gray-100 p-2 rounded-lg">
                          <MessageCircle className="h-5 w-5 text-gray-600" />
                        </div>
                        <span className="font-medium text-gray-900">
                          {selectedReport.contact_allowed 
                            ? (language === 'fr' ? 'Contact autorisé' : 'Jokkoo jaayoo')
                            : (language === 'fr' ? 'Contact non autorisé' : 'Jokkoo jaayoowul')
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            {t('nav.my_reports')}
          </h1>
          <p className="text-lg text-gray-600">
            {language === 'fr' 
              ? 'Suivez l\'évolution de vos signalements et leur traitement par les autorités'
              : 'Topp sa baxal yi ak lu nekk ci autorités yi'
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl shadow-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{statusCounts.all}</p>
                  <p className="text-sm text-gray-600 font-medium">{language === 'fr' ? 'Total' : 'Ëpp'}</p>
                </div>
              </div>
              <TrendingUp className="h-5 w-5 text-blue-400" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-4 rounded-xl shadow-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{statusCounts.reviewing}</p>
                  <p className="text-sm text-gray-600 font-medium">{language === 'fr' ? 'En cours' : 'Ci def'}</p>
                </div>
              </div>
              <Activity className="h-5 w-5 text-amber-400" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-xl shadow-lg">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{statusCounts.investigating}</p>
                  <p className="text-sm text-gray-600 font-medium">{language === 'fr' ? 'Enquête' : 'Wut'}</p>
                </div>
              </div>
              <Activity className="h-5 w-5 text-orange-400" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-xl shadow-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{statusCounts.resolved}</p>
                  <p className="text-sm text-gray-600 font-medium">{language === 'fr' ? 'Résolus' : 'Jaax'}</p>
                </div>
              </div>
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={language === 'fr' ? 'Rechercher dans vos signalements...' : 'Wut ci sa baxal yi...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 focus:bg-white"
                />
              </div>
            </div>
            <div className="md:w-64">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="all">{language === 'fr' ? 'Tous les statuts' : 'Statut yépp'}</option>
                  <option value="submitted">{t('status.submitted')}</option>
                  <option value="reviewing">{t('status.reviewing')}</option>
                  <option value="investigating">{t('status.investigating')}</option>
                  <option value="resolved">{t('status.resolved')}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-gray-600 text-lg font-medium">
                {language === 'fr' ? 'Chargement de vos signalements...' : 'Daje sa baxal yi...'}
              </p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-6 rounded-full inline-block mb-6">
                <FileText className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {language === 'fr' ? 'Aucun signalement trouvé' : 'Amul baxal'}
              </h3>
              <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                {language === 'fr' 
                  ? 'Vous n\'avez pas encore fait de signalement ou aucun ne correspond à vos critères.'
                  : 'Defuloo baxal walla amul benn bu moom sa critères yi.'
                }
              </p>
              <button
                onClick={() => onPageChange('report')}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {language === 'fr' ? 'Faire un signalement' : 'Def ab baxal'}
              </button>
            </div>
          ) : (
            filteredReports.map((report) => {
              const category = categories.find(c => c.id === report.category_id);
              
              return (
                <div 
                  key={report.id} 
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          {category && (
                            <div 
                              className="w-4 h-4 rounded-full shadow-md"
                              style={{ backgroundColor: category.color }}
                            ></div>
                          )}
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{report.title}</h3>
                          {report.is_anonymous && (
                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold border border-blue-200 flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              {language === 'fr' ? 'Anonyme' : 'Sutura'}
                            </span>
                          )}
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(report.status)}`}>
                            {getStatusIcon(report.status)}
                            {t(`status.${report.status}`)}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4 line-clamp-2 text-base leading-relaxed">{report.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                            <Calendar className="h-4 w-4" />
                            {new Date(report.created_at).toLocaleDateString('fr-FR', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </span>
                          <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                            <MapPin className="h-4 w-4" />
                            {report.location_text || report.region}
                          </span>
                        </div>
                      </div>
                      <div className="md:ml-6 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReport(report);
                          }}
                          className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 whitespace-nowrap"
                        >
                          <Eye className="h-4 w-4" />
                          <span>{language === 'fr' ? 'Voir détails' : 'Gis détail'}</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 rounded-3xl p-10 text-white text-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-5"></div>
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4">
              {language === 'fr' ? 'Besoin d\'aide ?' : 'Soxla nga ndimbalante ?'}
            </h3>
            <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
              {language === 'fr' 
                ? 'Notre équipe est là pour vous accompagner dans vos démarches'
                : 'Nun la ekip bi fii ngir dimbalante la ci sa jëf yi'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onPageChange('emergency')}
                className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {language === 'fr' ? '📞 Contacts d\'urgence' : '📞 Jokkoo yu caxaan'}
              </button>
              <button
                onClick={() => onPageChange('report')}
                className="bg-indigo-800 hover:bg-indigo-900 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {language === 'fr' ? '➕ Nouveau signalement' : '➕ Baxal bu bees'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};