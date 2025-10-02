import { useState } from "react";

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
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {complaint.plaintiff_first_name} {complaint.plaintiff_last_name}
          </h3>
          <p className="text-gray-600 line-clamp-2">{complaint.facts}</p>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(complaint.complaint_date).toLocaleDateString("fr-FR")} -{" "}
            {complaint.complaint_city}
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors flex items-center space-x-1"
        >
          {isExpanded ? "Masquer les détails" : "Voir les détails"}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 border-t pt-4 space-y-2 text-sm text-gray-700">
          {/* Défendeur */}
          <h4 className="font-semibold text-gray-900">
            Informations sur le défendeur
          </h4>
          {complaint.defendant_unknown ? (
            <p>Défendeur inconnu</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                Nom: {complaint.defendant_first_name}{" "}
                {complaint.defendant_last_name}
              </div>
              <div>
                Naissance: {complaint.defendant_birth_date || "N/A"} à{" "}
                {complaint.defendant_birth_place}
              </div>
              <div>
                Nationalité: {complaint.defendant_nationality || "N/A"}
              </div>
              <div>
                Adresse: {complaint.defendant_address},{" "}
                {complaint.defendant_city}, {complaint.defendant_postal_code}
              </div>
            </div>
          )}

          {/* Avocat */}
          {complaint.lawyer_name && (
            <>
              <h4 className="font-semibold text-gray-900 mt-2">
                Informations sur l'avocat
              </h4>
              <p>
                {complaint.lawyer_name} - {complaint.lawyer_address}
              </p>
            </>
          )}

          {/* Pièces jointes */}
          {attachments.length > 0 && (
            <>
              <h4 className="font-semibold text-gray-900 mt-2">
                Pièces jointes
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {attachments.map((file: Attachment, index: number) => {
                  const isImage = file.file.match(/\.(jpeg|jpg|png|gif)$/i);
                  const isPDF = file.file.match(/\.pdf$/i);

                  if (isImage) {
                    return (
                      <img
                        key={index}
                        src={file.file}
                        alt={file.file_name || `Attachment ${index + 1}`}
                        className="w-full h-40 object-cover rounded"
                      />
                    );
                  } else if (isPDF) {
                    return (
                      <a
                        key={index}
                        href={file.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        📄 {file.file_name || `PDF ${index + 1}`}
                      </a>
                    );
                  } else {
                    return (
                      <a
                        key={index}
                        href={file.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:underline"
                      >
                        📎 {file.file_name || `Fichier ${index + 1}`}
                      </a>
                    );
                  }
                })}
              </div>
            </>
          )}

          <p className="text-gray-500 mt-2">
            Soumis par: {complaint.submitted_by?.username || "Utilisateur anonyme"}
          </p>
        </div>
      )}
    </div>
  );
};
