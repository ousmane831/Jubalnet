import React, { useState, useEffect } from 'react';
import {  
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
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
import { RoleManagement } from './RoleManagement';
import { MapAndCharts } from './MapAndCharts';
import { ComplaintCard } from './ComplaintCard';
import UserRoleBadge from '../UI/UserRoleBadge';
import { ReportClassifier } from '../../utils/reportClassifier';

interface DashboardPageProps {
  onPageChange: (page: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onPageChange }) => {
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [reports, setReports] = useState<CrimeReport[]>([]);
  const [categories, setCategories] = useState<CrimeCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedReport, setExpandedReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState({
    total_reports: 0,
    resolved_reports: 0,
    in_progress_reports: 0,
    urgent_reports: 0
  });
  const [activeTab, setActiveTab] = useState("reports"); // reports | roles

const [complaints, setComplaints] = useState<any[]>([]);

  // Vérifier les permissions d'accès
  const hasAccess = isAuthenticated && user && ['authority', 'admin', 'moderator'].includes(user.role);

  useEffect(() => {
    if (hasAccess) {
      loadDashboardData();
    }
  }, [hasAccess]);

 const loadDashboardData = async () => {
  try {
    console.log('Début du chargement des données du tableau de bord...');
    setIsLoading(true);
    setError(null);
    
    // Vérifier d'abord si l'utilisateur est connecté
    if (!isAuthenticated || !user) {
      console.error('Utilisateur non authentifié');
      setError('Vous devez être connecté pour accéder à cette page');
      setIsLoading(false);
      return;
    }
    
    console.log('Utilisateur connecté:', user);
    
    // Récupérer les plaintes avec gestion d'erreur séparée
    let complaintsData = { results: [] };
    try {
      console.log('Tentative de récupération des plaintes...');
      complaintsData = await apiService.getComplaints();
      console.log('Plaintes récupérées avec succès:', complaintsData);
      console.log('Détails des plaintes brutes:', JSON.stringify(complaintsData, null, 2));
    } catch (complaintError) {
      console.error('Erreur lors de la récupération des plaintes:', complaintError);
      setError('Erreur lors du chargement des plaintes');
    }
    
    // Récupérer les autres données en parallèle avec gestion d'erreur
    let reportsData = { results: [] };
    let categoriesData = { results: [] };
    let statsData = {};
    
    try {
      [reportsData, categoriesData, statsData] = await Promise.all([
        apiService.getReports().catch(e => {
          console.error('Erreur lors de la récupération des signalements:', e);
          return { results: [] };
        }),
        apiService.getCategories().catch(e => {
          console.error('Erreur lors de la récupération des catégories:', e);
          return { results: [] };
        }),
        apiService.getStatistics().catch(e => {
          console.error('Erreur lors de la récupération des statistiques:', e);
          return {};
        })
      ]);
      
      console.log('Données reçues - Signalements:', reportsData);
      console.log('Données reçues - Plaintes:', complaintsData);
      
      // Gestion des plaintes avec vérification plus robuste
      let complaintsList = [];
      if (Array.isArray(complaintsData)) {
        complaintsList = complaintsData;
      } else if (complaintsData && Array.isArray(complaintsData.results)) {
        complaintsList = complaintsData.results;
      }
      
      console.log(`Nombre de plaintes après traitement: ${complaintsList.length}`);
      
      // Mise à jour des états avec vérification de type
      setReports(Array.isArray(reportsData) ? reportsData : (reportsData?.results || []));
      setComplaints(complaintsList);
      setCategories(Array.isArray(categoriesData) ? categoriesData : (categoriesData?.results || []));
      
      // Calcul des statistiques
      const reports = Array.isArray(reportsData) ? reportsData : (reportsData?.results || []);
      setStatistics({
        total_reports: reports.length,
        resolved_reports: reports.filter((r: any) => r.status === 'resolved').length,
        in_progress_reports: reports.filter((r: any) => r.status === 'investigating').length,
        urgent_reports: reports.filter((r: any) => r.priority === 'urgent').length
      });
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setError('Une erreur est survenue lors du chargement des données');
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    
    // Gestion plus détaillée des erreurs
    let errorMessage = 'Une erreur est survenue lors du chargement des données';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      if ('response' in error) {
        // Erreur avec réponse HTTP
        const response = (error as any).response;
        console.error('Détails de l\'erreur HTTP:', {
          status: response.status,
          statusText: response.statusText,
          data: response.data
        });
        
        if (response.status === 401) {
          errorMessage = 'Session expirée. Veuillez vous reconnecter.';
        } else if (response.status === 403) {
          errorMessage = 'Vous n\'avez pas les permissions nécessaires pour accéder à cette ressource.';
        } else if (response.data?.detail) {
          errorMessage = response.data.detail;
        }
      }
    }
    
    setError(errorMessage);
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
    
    // Filtrage par département pour les autorités
    const categoryId = (report.category as any)?.id || report.category; // Gérer objet vs nombre
    const categoryName = categories.find(c => c.id === categoryId || c.id === String(categoryId))?.name_fr || '';
    const classification = ReportClassifier.classifyReport(
      categoryName,
      report.region,
      report.description
    );
    
    console.log(`Signalement ${report.id}: category="${JSON.stringify(report.category)}", Catégorie="${categoryName}", Région="${report.region}" -> Département="${classification.department}"`);
    console.log(`Catégories disponibles:`, categories.map(c => ({id: c.id, name: c.name_fr})));
    
    const canView = ReportClassifier.canUserViewReport(
      user?.department,
      classification.department,
      user?.role || ''
    );
    
    return matchesStatus && matchesPriority && matchesSearch && canView;
  });

  // Filtrer les plaintes selon le département de l'utilisateur
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.facts.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.complaint_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${complaint.plaintiff_first_name} ${complaint.plaintiff_last_name}`.toLowerCase().includes(searchTerm.toLowerCase());

    // Classification par département
    const categoryId = complaint.category?.id || complaint.category; // Gérer objet vs ID direct
    const categoryName = categories.find(c => c.id === categoryId)?.name_fr || '';
    
    console.log(`Dashboard - Complaint ID: ${complaint.id}`);
    console.log(`- Category ID: ${categoryId}`);
    console.log(`- Category Name: "${categoryName}"`);
    console.log(`- Available categories:`, categories.map(c => ({id: c.id, name: c.name_fr})));
    
    const classification = ReportClassifier.classifyReport(
      categoryName,
      complaint.complaint_city, // Utiliser la ville comme région
      complaint.facts
    );

    console.log(`Plainte ${complaint.id}: category="${categoryId}", Catégorie="${categoryName}", Ville="${complaint.complaint_city}" -> Département="${classification.department}"`);

    const canView = ReportClassifier.canUserViewReport(
      user?.department,
      classification.department,
      user?.role || ''
    );
    
    console.log(`- User department: ${user?.department}`);
    console.log(`- Can view: ${canView}`);

    return matchesSearch && canView;
  });

  const statusOptions = [
    { value: 'all', label: language === 'fr' ? 'Tous les statuts' : 'Statut yépp' },
    { value: 'submitted', label: language === 'fr' ? 'Soumis' : 'Yónnee' },
    { value: 'investigating', label: language === 'fr' ? 'En enquête' : 'Ci wut' },
    { value: 'resolved', label: language === 'fr' ? 'Résolu' : 'Jaax' },
    { value: 'closed', label: language === 'fr' ? 'Fermé' : 'Tax' }
  ];


  const exportReports = () => {
  if (filteredReports.length === 0) {
    alert(language === 'fr' ? "Aucun signalement à exporter" : "Amul reports bu may jëf");
    return;
  }

  // Générer le contenu CSV
  const headers = ['ID', 'Titre', 'Description', 'Catégorie', 'Statut', 'Priorité', 'Région', 'Date'];
  const rows = filteredReports.map(report => {
    const category = categories.find(c => c.id === report.category_id);
    return [
      report.id,
      `"${report.title}"`,
      `"${report.description}"`,
      category?.name_fr || category?.name_wo || '',
      report.status,
      report.priority,
      report.region,
      new Date(report.created_at).toLocaleString('fr-FR')
    ];
  });

  const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');

  // Créer un lien temporaire pour le téléchargement
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'signalements.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  return (
    <div className="min-h-screen bg-green-to-br from-green-50 via-green-50/30 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header avec gradient moderne */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-600 via-green-700 to-green-700 rounded-2xl shadow-2xl p-8 mb-6 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    <Shield className="h-8 w-8" />
                  </div>
            <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-1">
                      {language === 'fr' ? 'Tableau de Bord Administratif' : 'Tabloam bopp - Administrative'}
              </h1>
                    <p className="text-blue-100 text-lg">
                {language === 'fr' 
                  ? 'Gestion et traitement des signalements de crimes'
                  : 'Gestion ak traitement signalements yu njub'
                }
              </p>
                  </div>
                </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={loadDashboardData}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                  <RefreshCw className="h-5 w-5" />
                <span>{language === 'fr' ? 'Actualiser' : 'Actualiser'}</span>
              </button>
              <button
                onClick={exportReports}
                  className="bg-white text-blue-700 hover:bg-blue-50 px-5 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                  <Download className="h-5 w-5" />
                <span>{language === 'fr' ? 'Exporter' : 'Exporter'}</span>
              </button>
              </div>
            </div>
            
            {/* Badge utilisateur */}
            <div className="mt-4">
              <UserRoleBadge showUserInfo={true} showPermissions={false} />
            </div>
          </div>

          {/* Onglets modernes avec indicateurs */}
          <div className="bg-white rounded-xl shadow-lg p-2 mb-6 flex flex-wrap gap-2">
  <button
    onClick={() => setActiveTab("reports")}
              className={`relative px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                activeTab === "reports" 
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FileText className="h-5 w-5" />
              <span>{language === "fr" ? "Signalements" : "Reports"}</span>
              {activeTab === "reports" && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {filteredReports.length}
                </span>
              )}
  </button>

  <button
    onClick={() => setActiveTab("complaints")}
              className={`relative px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                activeTab === "complaints" 
                  ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FileText className="h-5 w-5" />
              <span>{language === "fr" ? "Plaintes" : "Complaints"}</span>
              {activeTab === "complaints" && filteredComplaints.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {filteredComplaints.length}
                </span>
              )}
  </button>

  {user?.role === "admin" && (
    <button
      onClick={() => setActiveTab("roles")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === "roles" 
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <User className="h-5 w-5" />
                <span>{language === "fr" ? "Gestion des rôles" : "Sàmm rôle yi"}</span>
    </button>
  )}

  <button
    onClick={() => setActiveTab("map")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                activeTab === "map" 
                  ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <MapPin className="h-5 w-5" />
              <span>{language === "fr" ? "Carte & Statistiques" : "Kàrt ak Statistiques"}</span>
  </button>
</div>
        </div>

        {/* Statistics Cards améliorées avec animations - Affichées uniquement pour l'onglet Signalements */}
        {activeTab === "reports" && (
          <>
      

            {/* Filters améliorés */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-600" />
                  <span>{language === 'fr' ? 'Filtres de recherche' : 'Filtres wut'}</span>
                </h3>
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {filteredReports.length} {language === 'fr' ? 'résultats' : 'résultats'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                    placeholder={language === 'fr' ? 'Rechercher par titre, description, région...' : 'Wut ci title, description, région...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white cursor-pointer"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white cursor-pointer"
            >
              <option value="all">{language === 'fr' ? 'Toutes priorités' : 'Priorité yépp'}</option>
              <option value="urgent">{language === 'fr' ? 'Urgent' : 'Caxaan'}</option>
              <option value="high">{language === 'fr' ? 'Élevée' : 'Gën'}</option>
              <option value="medium">{language === 'fr' ? 'Moyenne' : 'Diggu'}</option>
              <option value="low">{language === 'fr' ? 'Faible' : 'Ndaw'}</option>
            </select>
              </div>
            </div>
          </>
        )}

        {/* Reports List */}
        {activeTab === "reports" ? (
        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-gray-600 text-lg font-medium">
                {language === 'fr' ? 'Chargement des signalements...' : 'Daje signalements yi...'}
              </p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-6 rounded-full inline-block mb-6">
                <FileText className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {language === 'fr' ? 'Aucun signalement trouvé' : 'Amul signalement'}
              </h3>
              <p className="text-gray-600 text-lg">
                {language === 'fr' 
                  ? 'Aucun signalement ne correspond aux critères sélectionnés.'
                  : 'Amul signalement bu moom critères yi nga tànn.'
                }
              </p>
            </div>
          ) : (
            filteredReports.map((report) => {
              const categoryId = (report.category as any)?.id || report.category;
              const categoryName = categories.find(c => c.id === categoryId || c.id === String(categoryId))?.name_fr || '';
              const category = categories.find(c => c.id === categoryId || c.id === String(categoryId));
              const isExpanded = expandedReport === report.id;
              const classification = ReportClassifier.classifyReport(
                categoryName,
                report.region,
                report.description
              );
              const departmentInfo = ReportClassifier.getDepartmentInfo()[classification.department];
              
              return (
                <div key={report.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-3 mb-3">
                          <div 
                            className="w-4 h-4 rounded-full shadow-sm"
                            style={{ backgroundColor: category?.color || '#6B7280' }}
                          ></div>
                          <h3 className="text-xl font-bold text-gray-900">{report.title}</h3>
                          {report.is_anonymous && (
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-blue-200 flex items-center space-x-1">
                              <Shield className="h-3.5 w-3.5" />
                              <span>{language === 'fr' ? 'Anonyme' : 'Sutura'}</span>
                            </div>
                          )}
                          <div className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 ${getPriorityColor(report.priority)}`}>
                            {report.priority.toUpperCase()}
                          </div>
                          <div 
                            className="px-3 py-1.5 rounded-full text-xs font-semibold border-2 flex items-center space-x-1"
                            style={{ 
                              backgroundColor: `${departmentInfo.color}20`,
                              borderColor: departmentInfo.color,
                              color: departmentInfo.color 
                            }}
                          >
                            <Shield className="h-3.5 w-3.5" />
                            <span>{departmentInfo.name.split(' ')[0]}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2 text-base leading-relaxed">{report.description}</p>
                        
                        <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600">
                          <span className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{new Date(report.created_at).toLocaleDateString('fr-FR', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric' 
                            })}</span>
                          </span>
                          <span className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{report.location_text || report.region}</span>
                          </span>
                          {!report.is_anonymous && (
                            <span className="flex items-center space-x-2 bg-green-50 px-3 py-1.5 rounded-lg text-green-700">
                              <User className="h-4 w-4" />
                              <span className="font-medium">{language === 'fr' ? 'Contact autorisé' : 'Jokkoo jaayoo'}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="ml-6 text-right space-y-3 flex-shrink-0">
                        <div className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold border-2 shadow-sm ${getStatusColor(report.status)}`}>
                          {getStatusIcon(report.status)}
                          <span className="ml-2">
                            {statusOptions.find(s => s.value === report.status)?.label || report.status}
                          </span>
                        </div>
                        
                          <button
                            onClick={() => setExpandedReport(isExpanded ? null : report.id)}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                          >
                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            <span>{language === 'fr' ? 'Détails' : 'Détail'}</span>
                          </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t-2 border-gray-100 pt-6 mt-6 bg-gradient-to-br from-gray-50 to-white rounded-xl p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                              <h4 className="font-bold text-gray-900 mb-3 flex items-center space-x-2 text-lg">
                                <FileText className="h-5 w-5 text-blue-600" />
                                <span>{language === 'fr' ? 'Description complète' : 'Ñakk bu moom'}</span>
                              </h4>
                              <p className="text-gray-700 leading-relaxed text-base">
                                {report.description}
                              </p>
                            </div>
                            
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                              <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2 text-lg">
                                <Calendar className="h-5 w-5 text-orange-600" />
                                <span>{language === 'fr' ? 'Détails de l\'incident' : 'Détail yu xeey bi'}</span>
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                                  <span className="text-sm font-semibold text-gray-600 block mb-1">{language === 'fr' ? 'Date' : 'Bees'}</span>
                                  <span className="font-bold text-gray-900">{report.incident_date}</span>
                                </div>
                                {report.incident_time && (
                                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                                    <span className="text-sm font-semibold text-gray-600 block mb-1">{language === 'fr' ? 'Heure' : 'Waxtu'}</span>
                                    <span className="font-bold text-gray-900">{report.incident_time}</span>
                                  </div>
                                )}
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-600 block mb-1">{language === 'fr' ? 'Région' : 'Réegion'}</span>
                                  <span className="font-bold text-gray-900">{report.region}</span>
                                </div>
                              </div>
                                </div>

                              {/* Médias attachés */}
                              {report.media_files && report.media_files.length > 0 && (
                              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2 text-lg">
                                  <FileText className="h-5 w-5 text-purple-600" />
                                  <span>{language === 'fr' ? 'Pièces jointes' : 'Jappante yi'}</span>
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {report.media_files.map((media: any) => (
                                      <a
                                        key={media.id}
                                        href={media.file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-md"
                                      >
                                      <div className="bg-blue-100 p-2 rounded-lg">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                      </div>
                                      <span className="text-blue-600 hover:text-blue-700 font-medium text-sm flex-1 truncate">{media.file_name}</span>
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Audio attaché */}
                              {report.voice_report && (
                              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2 text-lg">
                                  <FileText className="h-5 w-5 text-green-600" />
                                  <span>{language === 'fr' ? 'Rapport vocal' : 'Rapport ci baat'}</span>
                                </h4>
                                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                                  <audio controls className="w-full">
                                    <source src={report.voice_report.audio_file} type="audio/mpeg" />
                                    {language === 'fr' ? 'Votre navigateur ne supporte pas la lecture audio.' : 'Navigateur bi du may la jàngal ci baat.'}
                                  </audio>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-6">
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 sticky top-4">
                              <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2 text-lg">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <span>{language === 'fr' ? 'Actions' : 'Jëf'}</span>
                              </h4>
                              <div className="space-y-3">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  {language === 'fr' ? 'Modifier le statut' : 'Soppi statut bi'}
                                </label>
                                <select
                                  value={report.status}
                                  onChange={(e) => updateReportStatus(report.id, e.target.value)}
                                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium bg-white cursor-pointer transition-all duration-200"
                                >
                                  {statusOptions.slice(1).map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                              <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2 text-lg">
                                <AlertTriangle className="h-5 w-5 text-gray-600" />
                                <span>{language === 'fr' ? 'Informations' : 'Xibaar'}</span>
                              </h4>
                              <div className="space-y-3">
                                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                  <div>
                                    <span className="text-xs font-semibold text-gray-500 block">ID</span>
                                    <span className="text-sm font-bold text-gray-900">
                                      {report.id ? String(report.id).substring(0, 8) : 'N/A'}...
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-100">
                                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                  <div>
                                    <span className="text-xs font-semibold text-gray-500 block">{language === 'fr' ? 'Créé le' : 'Sos ci'}</span>
                                    <span className="text-sm font-bold text-gray-900">{new Date(report.created_at).toLocaleString('fr-FR')}</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                  <div>
                                    <span className="text-xs font-semibold text-gray-500 block">{language === 'fr' ? 'Modifié le' : 'Soppi ci'}</span>
                                    <span className="text-sm font-bold text-gray-900">{new Date(report.updated_at).toLocaleString('fr-FR')}</span>
                                  </div>
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
         ) : activeTab === "complaints" ? (
  <div className="space-y-4">
    {isLoading ? (
              <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
                <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <p className="text-gray-600 text-lg font-medium">
                  {language === 'fr' ? 'Chargement des plaintes...' : 'Daje plaintes yi...'}
                </p>
              </div>
    ) : filteredComplaints.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-6 rounded-full inline-block mb-6">
                  <FileText className="h-16 w-16 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {language === 'fr' ? 'Aucune plainte trouvée' : 'Amul plainte'}
                </h3>
                <p className="text-gray-600 text-lg">
                  {language === 'fr' 
                    ? 'Aucune plainte ne correspond aux critères sélectionnés.'
                    : 'Amul plainte bu moom critères yi nga tànn.'
                  }
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">
                    {language === 'fr' ? 'Liste des plaintes' : 'Liste plaintes yi'}
                  </h3>
                  <span className="text-sm font-medium text-green-600 bg-green-50 px-4 py-2 rounded-full">
                    {filteredComplaints.length} {language === 'fr' ? 'plaintes' : 'plaintes'}
                  </span>
                </div>
                <div className="space-y-4">
                  {filteredComplaints.map((complaint) => (
        <ComplaintCard key={complaint.id} complaint={complaint} categories={categories} />
                  ))}
                </div>
              </div>
    )}
  </div>
) : activeTab === "roles" ? (
  <RoleManagement />
) : (
  <MapAndCharts reports={reports} />
)}
         </div>
    </div>
  );
};