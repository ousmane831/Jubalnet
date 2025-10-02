import React, { useEffect, useState } from "react";
import { Users, Shield, ChevronLeft, ChevronRight } from "lucide-react";
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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5; // 👈 Nombre d'utilisateurs par page

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
      alert("Impossible de changer le rôle.");
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="bg-red-50 p-6 rounded-xl text-center">
        <Shield className="h-10 w-10 text-red-600 mx-auto mb-2" />
        <p className="text-red-700 font-medium">
          {language === "fr"
            ? "Seuls les administrateurs peuvent gérer les rôles."
            : "Admin yi rekk moom gën japp rôle yi."}
        </p>
      </div>
    );
  }

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Users className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900">
          {language === "fr" ? "Gestion des rôles" : "Sàmm rôle yi"}
        </h2>
      </div>

      {isLoading ? (
        <p className="text-gray-600">
          {language === "fr" ? "Chargement..." : "Ci yoon..."}
        </p>
      ) : (
        <>
          {/* Tableau */}
          <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full bg-white text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">
                    Nom
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-600">
                    Rôle
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentUsers.map((u, idx) => (
                  <tr
                    key={u.id}
                    className={`hover:bg-blue-50 transition ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-2 font-medium text-gray-900">
                      {u.full_name}
                    </td>
                    <td className="px-4 py-2 text-gray-600">{u.email}</td>
                    <td className="px-4 py-2">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      >
                        <option value="citizen">Citizen</option>
                        <option value="authority">Authority</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-1 rounded-lg border bg-gray-50 hover:bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              {language === "fr" ? "Précédent" : "Bi jiitu"}
            </button>

            <span className="text-sm text-gray-600">
              Page {currentPage} / {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="flex items-center px-3 py-1 rounded-lg border bg-gray-50 hover:bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {language === "fr" ? "Suivant" : "Bi topp"}
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
