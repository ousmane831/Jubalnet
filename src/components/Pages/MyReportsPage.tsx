import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  Filter,
  Calendar,
  MapPin,
  User,
  Shield,
  Search,
  Download,
  MessageCircle
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
  const { user, isAuthenticated } = useAuth();
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'fr' ? 'Connexion Requise' : 'Connexion Wuute'}
          </h3>
          <p className="text-gray-600 mb-6">
            {language === 'fr' 
              ? 'Vous devez être connecté pour voir vos signalements.'
              : 'Wara nga togg ngir gis sa baxal yi.'
            }
          </p>
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => onPageChange('auth')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {language === 'fr' ? 'Se Connecter' : 'Togg'}
            </button>
            <button
              onClick={() => onPageChange('home')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
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
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'reviewing': return 'bg-yellow-100 text-yellow-800';
      case 'investigating': return 'bg-orange-100 text-orange-800';
      case 'forwarded': return 'bg-purple-100 text-purple-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button
              onClick={() => setSelectedReport(null)}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              ← {language === 'fr' ? 'Retour à mes signalements' : 'Dellu ci sama baxal yi'}
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{selectedReport.title}</h1>
                  <div className="flex items-center space-x-4 text-blue-100">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(selectedReport.created_at).toLocaleDateString('fr-FR')}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {selectedReport.location_text || selectedReport.region}
                    </span>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-full bg-white/20 flex items-center space-x-2`}>
                  {getStatusIcon(selectedReport.status)}
                  <span className="font-medium">{t(`status.${selectedReport.status}`)}</span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {language === 'fr' ? 'Description' : 'Ñakk'}
                    </h3>
                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                      {selectedReport.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {language === 'fr' ? 'Détails de l\'incident' : 'Détail yu xeey bi'}
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{language === 'fr' ? 'Date de l\'incident' : 'Beesu xeey bi'}:</span>
                        <span className="font-medium">{selectedReport.incident_date}</span>
                      </div>
                      {selectedReport.incident_time && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">{language === 'fr' ? 'Heure' : 'Waxtu'}:</span>
                          <span className="font-medium">{selectedReport.incident_time}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">{language === 'fr' ? 'Priorité' : 'Priorité'}:</span>
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          selectedReport.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          selectedReport.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          selectedReport.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedReport.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {language === 'fr' ? 'Catégorie' : 'Mbind'}
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category?.color }}
                        ></div>
                        <span className="font-medium">
                          {language === 'fr' ? category?.name_fr : category?.name_wo}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {language === 'fr' ? 'Informations' : 'Xibaar'}
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-sm">
                      <div className="flex items-center space-x-2">
                        {selectedReport.is_anonymous ? (
                          <>
                            <Shield className="h-4 w-4 text-blue-600" />
                            <span>{language === 'fr' ? 'Signalement anonyme' : 'Baxal bu sutura'}</span>
                          </>
                        ) : (
                          <>
                            <User className="h-4 w-4 text-gray-600" />
                            <span>{language === 'fr' ? 'Signalement identifié' : 'Baxal bu identifié'}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="h-4 w-4 text-gray-600" />
                        <span>
                          {selectedReport.contact_allowed 
                            ? (language === 'fr' ? 'Contact autorisé' : 'Jokkoo jaayoo')
                            : (language === 'fr' ? 'Contact non autorisé' : 'Jokkoo jaayoowul')
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {language === 'fr' ? 'Actions' : 'Jëf'}
                    </h3>
                    <div className="space-y-2">
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                        <Download className="h-4 w-4" />
                        <span>{language === 'fr' ? 'Télécharger PDF' : 'Télécharger PDF'}</span>
                      </button>
                      {!selectedReport.is_anonymous && (
                        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                          <MessageCircle className="h-4 w-4" />
                          <span>{language === 'fr' ? 'Contacter autorités' : 'Jokkoo autorités yi'}</span>
                        </button>
                      )}
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.all}</p>
                <p className="text-sm text-gray-600">{language === 'fr' ? 'Total' : 'Ëpp'}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.reviewing}</p>
                <p className="text-sm text-gray-600">{language === 'fr' ? 'En cours' : 'Ci def'}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-3 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.investigating}</p>
                <p className="text-sm text-gray-600">{language === 'fr' ? 'Enquête' : 'Wut'}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.resolved}</p>
                <p className="text-sm text-gray-600">{language === 'fr' ? 'Résolus' : 'Jaax'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={language === 'fr' ? 'Rechercher dans vos signalements...' : 'Wut ci sa baxal yi...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="md:w-64">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

        {/* Reports List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">
                {language === 'fr' ? 'Chargement de vos signalements...' : 'Daje sa baxal yi...'}
              </p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="bg-gray-100 p-4 rounded-full inline-block mb-4">
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {language === 'fr' ? 'Aucun signalement trouvé' : 'Amul baxal'}
              </h3>
              <p className="text-gray-600 mb-6">
                {language === 'fr' 
                  ? 'Vous n\'avez pas encore fait de signalement ou aucun ne correspond à vos critères.'
                  : 'Defuloo baxal walla amul benn bu moom sa critères yi.'
                }
              </p>
              <button
                onClick={() => onPageChange('report')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {language === 'fr' ? 'Faire un signalement' : 'Def ab baxal'}
              </button>
            </div>
          ) : (
            filteredReports.map((report) => {
              const category = categories.find(c => c.id === report.category_id);
              
              return (
                <div key={report.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category?.color }}
                          ></div>
                          <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                          {report.is_anonymous && (
                            <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                              <Shield className="h-3 w-3 inline mr-1" />
                              {language === 'fr' ? 'Anonyme' : 'Sutura'}
                            </div>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3 line-clamp-2">{report.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(report.created_at).toLocaleDateString('fr-FR')}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {report.location_text || report.region}
                          </span>
                        </div>
                      </div>
                      <div className="ml-6 text-right">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
                          {getStatusIcon(report.status)}
                          <span className="ml-1">{t(`status.${report.status}`)}</span>
                        </div>
                        <div className="mt-3">
                          <button
                            onClick={() => setSelectedReport(report)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                          >
                            <Eye className="h-4 w-4" />
                            <span>{language === 'fr' ? 'Voir détails' : 'Gis détail'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            {language === 'fr' ? 'Besoin d\'aide ?' : 'Soxla nga ndimbalante ?'}
          </h3>
          <p className="text-blue-100 mb-6">
            {language === 'fr' 
              ? 'Notre équipe est là pour vous accompagner dans vos démarches'
              : 'Nun la ekip bi fii ngir dimbalante la ci sa jëf yi'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onPageChange('emergency')}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              {language === 'fr' ? '📞 Contacts d\'urgence' : '📞 Jokkoo yu caxaan'}
            </button>
            <button
              onClick={() => onPageChange('report')}
              className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {language === 'fr' ? '➕ Nouveau signalement' : '➕ Baxal bu bees'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};