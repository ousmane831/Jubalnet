import { useState } from "react";
import { FileText, Calendar, MapPin, ChevronDown, ChevronRight } from "lucide-react";

interface Attachment {
  file: string;
  file_name?: string;
}

interface Complaint {
  plaintiff_first_name: string;
  plaintiff_last_name: string;
  facts: string;
  complaint_date: string;
  complaint_city: string;
  defendant_unknown?: boolean;
  defendant_first_name?: string;
  defendant_last_name?: string;
  defendant_birth_date?: string;
  defendant_birth_place?: string;
  defendant_nationality?: string;
  defendant_address?: string;
  defendant_city?: string;
  defendant_postal_code?: string;
  lawyer_name?: string;
  lawyer_address?: string;
  attachments?: Attachment[];
  submitted_by?: {
    username?: string;
  };
}

interface ComplaintCardProps {
  complaint: Complaint;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // ✅ ici attachments est bien typé
  const attachments: Attachment[] = complaint.attachments || [];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-3 rounded-xl">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {complaint.plaintiff_first_name} {complaint.plaintiff_last_name}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{new Date(complaint.complaint_date).toLocaleDateString("fr-FR", { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}</span>
                </span>
                <span className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{complaint.complaint_city}</span>
                </span>
              </div>
            </div>
          </div>
          <p className="text-gray-600 line-clamp-2 text-base leading-relaxed mb-4">{complaint.facts}</p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex-shrink-0"
        >
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <span>{isExpanded ? "Masquer les détails" : "Voir les détails"}</span>
        </button>
      </div>

      {isExpanded && (
        <div className="mt-6 border-t-2 border-gray-100 pt-6 bg-gradient-to-br from-gray-50 to-white rounded-xl p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations sur le défendeur */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2 text-lg">
                <FileText className="h-5 w-5 text-red-600" />
                <span>Informations sur le défendeur</span>
              </h4>
              {complaint.defendant_unknown ? (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <p className="text-red-700 font-semibold">Défendeur inconnu</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                    <span className="text-sm font-semibold text-gray-600 block mb-1">Nom complet</span>
                    <span className="font-bold text-gray-900">
                      {complaint.defendant_first_name} {complaint.defendant_last_name}
                    </span>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                    <span className="text-sm font-semibold text-gray-600 block mb-1">Date et lieu de naissance</span>
                    <span className="font-bold text-gray-900">
                      {complaint.defendant_birth_date || "N/A"} à {complaint.defendant_birth_place || "N/A"}
                    </span>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                    <span className="text-sm font-semibold text-gray-600 block mb-1">Nationalité</span>
                    <span className="font-bold text-gray-900">{complaint.defendant_nationality || "N/A"}</span>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                    <span className="text-sm font-semibold text-gray-600 block mb-1">Adresse</span>
                    <span className="font-bold text-gray-900">
                      {complaint.defendant_address || "N/A"}, {complaint.defendant_city || "N/A"}, {complaint.defendant_postal_code || "N/A"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Informations sur l'avocat et autres */}
            <div className="space-y-6">
              {/* Avocat */}
              {complaint.lawyer_name && (
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2 text-lg">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <span>Informations sur l'avocat</span>
                  </h4>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                    <span className="text-sm font-semibold text-gray-600 block mb-1">Nom</span>
                    <span className="font-bold text-gray-900">{complaint.lawyer_name}</span>
                  </div>
                  {complaint.lawyer_address && (
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200 mt-3">
                      <span className="text-sm font-semibold text-gray-600 block mb-1">Adresse</span>
                      <span className="font-bold text-gray-900">{complaint.lawyer_address}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Soumis par */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2 text-lg">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <span>Informations de soumission</span>
                </h4>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
                  <span className="text-sm font-semibold text-gray-600 block mb-1">Soumis par</span>
                  <span className="font-bold text-gray-900">
                    {complaint.submitted_by?.username || "Utilisateur anonyme"}
                  </span>
                </div>
              </div>
            </div>

            {/* Pièces jointes */}
            {attachments.length > 0 && (
              <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center space-x-2 text-lg">
                  <FileText className="h-5 w-5 text-green-600" />
                  <span>Pièces jointes</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {attachments.map((file: Attachment, index: number) => {
                    const isImage = file.file.match(/\.(jpeg|jpg|png|gif)$/i);
                    const isPDF = file.file.match(/\.pdf$/i);

                    if (isImage) {
                      return (
                        <div key={index} className="rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-200">
                          <img
                            src={file.file}
                            alt={file.file_name || `Attachment ${index + 1}`}
                            className="w-full h-48 object-cover"
                          />
                          {file.file_name && (
                            <div className="p-3 bg-gray-50">
                              <p className="text-sm font-medium text-gray-900 truncate">{file.file_name}</p>
                            </div>
                          )}
                        </div>
                      );
                    } else if (isPDF) {
                      return (
                        <a
                          key={index}
                          href={file.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-3 p-4 bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 rounded-xl border border-red-200 transition-all duration-200 hover:shadow-md"
                        >
                          <div className="bg-red-200 p-3 rounded-lg">
                            <FileText className="h-6 w-6 text-red-600" />
                          </div>
                          <span className="text-red-700 hover:text-red-800 font-semibold text-sm flex-1 truncate">
                            {file.file_name || `PDF ${index + 1}`}
                          </span>
                        </a>
                      );
                    } else {
                      return (
                        <a
                          key={index}
                          href={file.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl border border-gray-200 transition-all duration-200 hover:shadow-md"
                        >
                          <div className="bg-gray-200 p-3 rounded-lg">
                            <FileText className="h-6 w-6 text-gray-600" />
                          </div>
                          <span className="text-gray-700 hover:text-gray-800 font-semibold text-sm flex-1 truncate">
                            {file.file_name || `Fichier ${index + 1}`}
                          </span>
                        </a>
                      );
                    }
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
