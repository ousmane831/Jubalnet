import React, { useEffect, useState } from "react";
import { 
  Users, 
  Shield, 
  ChevronLeft, 
  ChevronRight,
  Search,
  Filter,
  UserCheck,
  UserX,
  Crown,
  AlertCircle,
  Mail,
  CheckCircle2,
  XCircle,
  RefreshCw
} from "lucide-react";
import { apiService } from "../../services/api";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AuthContext";

interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

export const RoleManagement: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs :", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await apiService.updateUserRole(userId, newRole);
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle :", error);
      alert(language === 'fr' ? "Impossible de changer le rôle." : "Duñu ko wàññi rôle bi.");
    }
  };

  // Filtrer et trier les utilisateurs
  const filteredUsers = users.filter((u) => {
    const fullName = (u.full_name || "").toString();
    const email = (u.email || "").toString();
    const role = u.role || "citizen";
    const matchesSearch = 
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Statistiques par rôle
  const roleStats = {
    citizen: users.filter((u) => (u.role || "citizen") === "citizen").length,
    authority: users.filter((u) => (u.role || "citizen") === "authority").length,
    moderator: users.filter((u) => (u.role || "citizen") === "moderator").length,
    admin: users.filter((u) => (u.role || "citizen") === "admin").length,
  };

  const getRoleInfo = (role: string) => {
    const roles: { [key: string]: { label: string; color: string; gradient: string; icon: any } } = {
      citizen: {
        label: language === "fr" ? "Citoyen" : "Citoyen",
        color: "blue",
        gradient: "from-blue-500 to-blue-600",
        icon: Users,
      },
      authority: {
        label: language === "fr" ? "Autorité" : "Autorité",
        color: "green",
        gradient: "from-green-500 to-green-600",
        icon: Shield,
      },
      moderator: {
        label: language === "fr" ? "Modérateur" : "Modérateur",
        color: "orange",
        gradient: "from-orange-500 to-orange-600",
        icon: UserCheck,
      },
      admin: {
        label: language === "fr" ? "Administrateur" : "Administrateur",
        color: "purple",
        gradient: "from-purple-500 to-purple-600",
        icon: Crown,
      },
    };
    return roles[role] || roles.citizen;
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-xl p-12 text-center border-2 border-red-200">
        <div className="bg-red-100 p-4 rounded-full inline-block mb-4">
          <Shield className="h-12 w-12 text-red-600" />
        </div>
        <h3 className="text-2xl font-bold text-red-900 mb-2">
          {language === "fr" ? "Accès Restreint" : "Dugg bu Takk"}
        </h3>
        <p className="text-red-700 font-medium">
          {language === "fr"
            ? "Seuls les administrateurs peuvent gérer les rôles."
            : "Admin yi rekk moom gën japp rôle yi."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 rounded-2xl shadow-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <Users className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-1">
                {language === "fr" ? "Gestion des Rôles" : "Sàmm Rôle yi"}
              </h2>
              <p className="text-purple-100">
                {language === "fr"
                  ? `${users.length} utilisateurs enregistrés`
                  : `${users.length} utilisateurs yu enregistré`}
              </p>
            </div>
          </div>
          <button
            onClick={loadUsers}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
          >
            <RefreshCw className="h-5 w-5" />
            <span>{language === "fr" ? "Actualiser" : "Actualiser"}</span>
          </button>
        </div>
      </div>

      {/* Statistiques par rôle */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(roleStats).map(([role, count]) => {
          const roleInfo = getRoleInfo(role);
          const IconComponent = roleInfo.icon;
          return (
            <div
              key={role}
              className="bg-white rounded-xl shadow-lg p-4 border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${roleInfo.gradient} text-white`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{count}</span>
              </div>
              <p className="text-sm font-semibold text-gray-600">{roleInfo.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={language === "fr" ? "Rechercher un utilisateur..." : "Wut utilisateur..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white cursor-pointer"
            >
              <option value="all">{language === "fr" ? "Tous les rôles" : "Rôle yépp"}</option>
              <option value="citizen">{language === "fr" ? "Citoyen" : "Citoyen"}</option>
              <option value="authority">{language === "fr" ? "Autorité" : "Autorité"}</option>
              <option value="moderator">{language === "fr" ? "Modérateur" : "Modérateur"}</option>
              <option value="admin">{language === "fr" ? "Administrateur" : "Administrateur"}</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">
            {language === "fr"
              ? `${filteredUsers.length} utilisateur(s) trouvé(s)`
              : `${filteredUsers.length} utilisateur(s) yu wut`}
          </span>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      {isLoading ? (
        <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-medium">
            {language === "fr" ? "Chargement des utilisateurs..." : "Daje utilisateurs yi..."}
          </p>
        </div>
      ) : currentUsers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
          <div className="bg-gray-100 p-4 rounded-full inline-block mb-4">
            <UserX className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {language === "fr" ? "Aucun utilisateur trouvé" : "Amul utilisateur"}
          </h3>
          <p className="text-gray-600">
            {language === "fr"
              ? "Aucun utilisateur ne correspond aux critères de recherche."
              : "Amul utilisateur bu moom critères wut bi."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {language === "fr" ? "Utilisateur" : "Utilisateur"}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {language === "fr" ? "Email" : "Email"}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {language === "fr" ? "Rôle actuel" : "Rôle bu am"}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {language === "fr" ? "Action" : "Jëf"}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {currentUsers.map((u) => {
                  const userRole = u.role || "citizen";
                  const roleInfo = getRoleInfo(userRole);
                  const IconComponent = roleInfo.icon;
                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${roleInfo.gradient} text-white`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">
                              {u.full_name || (language === "fr" ? "Utilisateur sans nom" : "Utilisateur bu amul tur")}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{u.email || "-"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${roleInfo.gradient} text-white`}>
                          {roleInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={userRole}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className={`px-4 py-2 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white cursor-pointer text-sm font-semibold border-gray-200 hover:border-purple-300`}
                        >
                          <option value="citizen">{language === "fr" ? "Citoyen" : "Citoyen"}</option>
                          <option value="authority">{language === "fr" ? "Autorité" : "Autorité"}</option>
                          <option value="moderator">{language === "fr" ? "Modérateur" : "Modérateur"}</option>
                          <option value="admin">{language === "fr" ? "Administrateur" : "Administrateur"}</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl border-2 bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold border-gray-200 hover:border-purple-300"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>{language === "fr" ? "Précédent" : "Bi jiitu"}</span>
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-gray-700">
                {language === "fr" ? "Page" : "Page"} {currentPage} / {totalPages}
              </span>
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl border-2 bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold border-gray-200 hover:border-purple-300"
            >
              <span>{language === "fr" ? "Suivant" : "Bi topp"}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
