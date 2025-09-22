import React, { useState, useEffect } from 'react';
import {  
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  MessageSquare,
  Filter,
  Search,
  Calendar,
  MapPin,
  User,
  Shield,
  ChevronDown,
  ChevronRight,
  Download,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import { CrimeReport, CrimeCategory } from '../../types';

interface DashboardPageProps {
  onPageChange: (page: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onPageChange }) => {
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [reports, setReports] = useState<CrimeReport[]>([]);
  const [categories, setCategories] = useState<CrimeCategory[]>([]);
  const [selectedReport, setSelectedReport] = useState<CrimeReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedReport, setExpandedReport] = useState<string | null>(null);
  const [statistics, setStatistics] = useState({
    total_reports: 0,
    resolved_reports: 0,
    in_progress_reports: 0,
    urgent_reports: 0
    
  });

  // Vérifier les permissions d'accès
  const hasAccess = isAuthenticated && user && ['authority', 'admin', 'moderator'].includes(user.role);

  useEffect(() => {
    if (hasAccess) {
      loadDashboardData();
    }
  }, [hasAccess]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [reportsData, categoriesData, statsData] = await Promise.all([
        apiService.getReports(),
        apiService.getCategories(),
        apiService.getStatistics()
      ]);
      
      setReports(reportsData.results || reportsData);
      setCategories(categoriesData);
      setStatistics({
        ...statsData,
        urgent_reports: (reportsData.results || reportsData).filter((r: CrimeReport) => r.priority === 'urgent').length
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateReportStatus = async (reportId: string, newStatus: string, comment?: string) => {
    try {
      await apiService.updateReportStatus(reportId, newStatus, comment);
      await loadDashboardData(); // Recharger les données
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  // Redirection si pas d'accès
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="bg-red-100 p-4 rounded-full inline-block mb-4">
            <Shield className="h-12 w-12 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'fr' ? 'Accès Restreint' : 'Dugg bu Takk'}
          </h3>
          <p className="text-gray-600 mb-6">
            {language === 'fr' 
              ? 'Cette page est réservée aux autorités compétentes. Vous n\'avez pas les permissions nécessaires.'
              : 'Xët wi mooy autorités yu am xam-xam rekk. Amul nga permissions yu wuute.'
            }
          </p>
          <button
            onClick={() => onPageChange('home')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {language === 'fr' ? 'Retour à l\'accueil' : 'Dellu ci accueil'}
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'reviewing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'investigating': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'forwarded': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || report.priority === priorityFilter;
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.region.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const statusOptions = [
    { value: 'all', label: language === 'fr' ? 'Tous les statuts' : 'Statut yépp' },
    { value: 'submitted', label: language === 'fr' ? 'Soumis' : 'Yónnee' },
    { value: 'reviewing', label: language === 'fr' ? 'En révision' : 'Ci gis' },
    { value: 'investigating', label: language === 'fr' ? 'En enquête' : 'Ci wut' },
    { value: 'forwarded', label: language === 'fr' ? 'Transmis' : 'Yónnee' },
    { value: 'resolved', label: language === 'fr' ? 'Résolu' : 'Jaax' },
    { value: 'closed', label: language === 'fr' ? 'Fermé' : 'Tax' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {language === 'fr' ? 'Tableau de Bord - Autorités' : 'Tabloam - Autorités'}
              </h1>
              <p className="text-lg text-gray-600">
                {language === 'fr' 
                  ? 'Gestion et traitement des signalements de crimes'
                  : 'Gestion ak traitement signalements yu njub'
                }
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={loadDashboardData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>{language === 'fr' ? 'Actualiser' : 'Actualiser'}</span>
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>{language === 'fr' ? 'Exporter' : 'Exporter'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {language === 'fr' ? 'Total Signalements' : 'Baxal yépp'}
                </p>
                <p className="text-3xl font-bold text-gray-900">{statistics.total_reports}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {language === 'fr' ? 'En Cours' : 'Ci def'}
                </p>
                <p className="text-3xl font-bold text-gray-900">{statistics.in_progress_reports}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {language === 'fr' ? 'Urgents' : 'Caxaan'}
                </p>
                <p className="text-3xl font-bold text-gray-900">{statistics.urgent_reports}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {language === 'fr' ? 'Résolus' : 'Jaax'}
                </p>
                <p className="text-3xl font-bold text-gray-900">{statistics.resolved_reports}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={language === 'fr' ? 'Rechercher...' : 'Wut...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{language === 'fr' ? 'Toutes priorités' : 'Priorité yépp'}</option>
              <option value="urgent">{language === 'fr' ? 'Urgent' : 'Caxaan'}</option>
              <option value="high">{language === 'fr' ? 'Élevée' : 'Gën'}</option>
              <option value="medium">{language === 'fr' ? 'Moyenne' : 'Diggu'}</option>
              <option value="low">{language === 'fr' ? 'Faible' : 'Ndaw'}</option>
            </select>

            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                {filteredReports.length} {language === 'fr' ? 'résultats' : 'résultats'}
              </span>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">
                {language === 'fr' ? 'Chargement des signalements...' : 'Daje signalements yi...'}
              </p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="bg-gray-100 p-4 rounded-full inline-block mb-4">
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {language === 'fr' ? 'Aucun signalement trouvé' : 'Amul signalement'}
              </h3>
              <p className="text-gray-600">
                {language === 'fr' 
                  ? 'Aucun signalement ne correspond aux critères sélectionnés.'
                  : 'Amul signalement bu moom critères yi nga tànn.'
                }
              </p>
            </div>
          ) : (
            filteredReports.map((report) => {
              const category = categories.find(c => c.id === report.category_id);
              const isExpanded = expandedReport === report.id;
              
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
                          <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(report.priority)}`}>
                            {report.priority.toUpperCase()}
                          </div>
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
                          {!report.is_anonymous && (
                            <span className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {language === 'fr' ? 'Contact autorisé' : 'Jokkoo jaayoo'}
                            </span>
                          )}
                        </div>
                      </div>

                                        
                      <div className="ml-6 text-right space-y-2">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(report.status)}`}>
                          {getStatusIcon(report.status)}
                          <span className="ml-1">
                            {statusOptions.find(s => s.value === report.status)?.label || report.status}
                          </span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setExpandedReport(isExpanded ? null : report.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors flex items-center space-x-1"
                          >
                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            <span>{language === 'fr' ? 'Détails' : 'Détail'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t pt-4 mt-4">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div className="lg:col-span-2 space-y-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">
                                {language === 'fr' ? 'Description complète' : 'Ñakk bu moom'}
                              </h4>
                              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                                {report.description}
                              </p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">
                                {language === 'fr' ? 'Détails de l\'incident' : 'Détail yu xeey bi'}
                              </h4>
                              <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">{language === 'fr' ? 'Date' : 'Bees'}:</span>
                                  <span className="font-medium">{report.incident_date}</span>
                                </div>
                                {report.incident_time && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">{language === 'fr' ? 'Heure' : 'Waxtu'}:</span>
                                    <span className="font-medium">{report.incident_time}</span>
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <span className="text-gray-600">{language === 'fr' ? 'Région' : 'Réegion'}:</span>
                                  <span className="font-medium">{report.region}</span>
                                </div>

{/* Médias attachés */}
{report.media_files && report.media_files.length > 0 && (
  <div>
    <h3 className="text-lg font-semibold text-gray-900 mb-3">
      {language === 'fr' ? 'Pièces jointes' : 'Jappante yi'}
    </h3>
    <div className="space-y-2">
      {report.media_files.map((media) => (
        <a
          key={media.id}
          href={media.file}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-blue-600 hover:underline"
        >
          📎 {media.file_name}
        </a>
      ))}
    </div>
  </div>
)}

{/* Audio attaché */}
{report.voice_report && (
  <div>
    <h3 className="text-lg font-semibold text-gray-900 mb-3">
      {language === 'fr' ? 'Rapport vocal' : 'Rapport ci baat'}
    </h3>
    <audio controls className="w-full">
      <source src={report.voice_report.audio_file} type="audio/mpeg" />
      {language === 'fr' ? 'Votre navigateur ne supporte pas la lecture audio.' : 'Navigateur bi du may la jàngal ci baat.'}
    </audio>
  </div>
)}
                                
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">
                                {language === 'fr' ? 'Actions' : 'Jëf'}
                              </h4>
                              <div className="space-y-2">
                                <select
                                  value={report.status}
                                  onChange={(e) => updateReportStatus(report.id, e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                >
                                  {statusOptions.slice(1).map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                  ))}
                                </select>
                                
                                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1">
                                  <MessageSquare className="h-4 w-4" />
                                  <span>{language === 'fr' ? 'Ajouter commentaire' : 'Yokk commentaire'}</span>
                                </button>
                                
                                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1">
                                  <Download className="h-4 w-4" />
                                  <span>{language === 'fr' ? 'Télécharger PDF' : 'Télécharger PDF'}</span>
                                </button>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">
                                {language === 'fr' ? 'Informations' : 'Xibaar'}
                              </h4>
                              <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-xs">
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span>ID: {report.id}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span>{language === 'fr' ? 'Créé le' : 'Sos ci'}: {new Date(report.created_at).toLocaleString('fr-FR')}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                  <span>{language === 'fr' ? 'Modifié le' : 'Soppi ci'}: {new Date(report.updated_at).toLocaleString('fr-FR')}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};