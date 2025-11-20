import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Calendar,
  MapPin,
  MessageCircle,
  Search,
  Filter,
  Bell,
  Shield
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import { ComplaintCard } from './ComplaintCard';
import { ComplaintMessages } from './ComplaintMessages';

interface MyComplaintsPageProps {
  onPageChange: (page: string) => void;
}

export const MyComplaintsPage: React.FC<MyComplaintsPageProps> = ({ onPageChange }) => {
  const { language, t } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadComplaints();
    }
  }, [isAuthenticated]);

  const loadComplaints = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getComplaints();
      setComplaints(data.results || data);
    } catch (error) {
      console.error('Erreur lors du chargement des plaintes:', error);
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
              ? 'Vous devez être connecté pour voir vos plaintes.'
              : 'Wara nga togg ngir gis sa plaintes yi.'
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

  const filteredComplaints = complaints.filter(complaint => {
    const searchLower = searchTerm.toLowerCase();
    return (
      complaint.plaintiff_first_name?.toLowerCase().includes(searchLower) ||
      complaint.plaintiff_last_name?.toLowerCase().includes(searchLower) ||
      complaint.facts?.toLowerCase().includes(searchLower) ||
      complaint.complaint_city?.toLowerCase().includes(searchLower)
    );
  });

  const totalUnreadMessages = complaints.reduce((sum, complaint) => {
    return sum + (complaint.unread_messages_count || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              {language === 'fr' ? 'Mes Plaintes' : 'Sama Plaintes'}
            </h1>
            {totalUnreadMessages > 0 && (
              <div className="relative">
                <Bell className="h-8 w-8 text-indigo-600 animate-pulse" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {totalUnreadMessages > 9 ? '9+' : totalUnreadMessages}
                </span>
              </div>
            )}
          </div>
          <p className="text-lg text-gray-600">
            {language === 'fr' 
              ? 'Gérez vos plaintes et communiquez avec l\'administration'
              : 'Topp sa plaintes yi ak jëfandikoo ak administrateur yi'
            }
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{complaints.length}</p>
                <p className="text-sm text-gray-600 font-medium mt-1">
                  {language === 'fr' ? 'Total plaintes' : 'Plaintes yépp'}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{totalUnreadMessages}</p>
                <p className="text-sm text-gray-600 font-medium mt-1">
                  {language === 'fr' ? 'Messages non lus' : 'Bataaxal bu jàngul'}
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-xl shadow-lg">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{filteredComplaints.length}</p>
                <p className="text-sm text-gray-600 font-medium mt-1">
                  {language === 'fr' ? 'Résultats' : 'Njëkk'}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl shadow-lg">
                <Search className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={language === 'fr' ? 'Rechercher dans vos plaintes...' : 'Wut ci sa plaintes yi...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Complaints List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-gray-600 text-lg font-medium">
                {language === 'fr' ? 'Chargement de vos plaintes...' : 'Daje sa plaintes yi...'}
              </p>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-6 rounded-full inline-block mb-6">
                <FileText className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {language === 'fr' ? 'Aucune plainte trouvée' : 'Amul plainte'}
              </h3>
              <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                {language === 'fr' 
                  ? searchTerm 
                    ? 'Aucune plainte ne correspond à votre recherche.'
                    : 'Vous n\'avez pas encore soumis de plainte.'
                  : searchTerm
                  ? 'Amul plainte bu moom sa wut bi.'
                  : 'Defuleenoo plainte ci saa si.'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => onPageChange('plaint')}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {language === 'fr' ? 'Soumettre une plainte' : 'Yónnee ab plainte'}
                </button>
              )}
            </div>
          ) : (
            filteredComplaints.map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))
          )}
        </div>
      </div>

      {/* Messages Modal */}
      {selectedComplaint && (
        <ComplaintMessages
          complaintId={selectedComplaint.id}
          complaintTitle={`Plainte de ${selectedComplaint.plaintiff_first_name} ${selectedComplaint.plaintiff_last_name}`}
          isOpen={isMessagesOpen}
          onClose={() => {
            setIsMessagesOpen(false);
            setSelectedComplaint(null);
            loadComplaints(); // Recharger pour mettre à jour les compteurs
          }}
        />
      )}
    </div>
  );
};


