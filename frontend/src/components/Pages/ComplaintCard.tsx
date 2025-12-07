import { useState } from "react";
import { FileText, Calendar, MapPin, ChevronDown, ChevronRight, MessageCircle, Download } from "lucide-react";
import { ComplaintMessages } from "./ComplaintMessages";

interface Attachment {
  file: string;
  file_name?: string;
}

interface Complaint {
  id?: string;
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
  unread_messages_count?: number;
}

interface ComplaintCardProps {
  complaint: Complaint;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);

  const exportToPDF = async () => {
    console.log('Export PDF clicked for complaint:', complaint.id);
    
    try {
      // Créer un nouveau document PDF
      const pdfDoc = await createPDFDocument();
      
      // Ajouter le contenu de la plainte
      await addComplaintContent(pdfDoc, complaint);
      
      // Télécharger le PDF
      await downloadPDF(pdfDoc, `plainte_${complaint.id || 'unknown'}.pdf`);
      
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      // Fallback: export texte si PDF échoue
      exportTextFallback();
    }
  };

  const createPDFDocument = async () => {
    // Utiliser l'API PDF du navigateur si disponible
    if ('pdf' in window && (window as any).pdf) {
      return new (window as any).pdf.PDFDocument();
    }
    
    // Sinon, créer un PDF manuellement avec jsPDF-like approach
    return createSimplePDF();
  };

  const createSimplePDF = () => {
    interface PageItem {
      text: string;
      x: number;
      y: number;
    }
    
    return {
      pages: [] as PageItem[][],
      addPage: function() {
        this.pages.push([]);
        return this;
      },
      text: function(text: string, x: number, y: number) {
        if (this.pages.length === 0) this.addPage();
        this.pages[this.pages.length - 1].push({ text, x, y });
        return this;
      },
      save: function() {
        return this.generatePDFString();
      },
      generatePDFString: function() {
        let pdfContent = '%PDF-1.4\n';
        const pageContent = this.pages.map(page => 
          page.map(item => `BT /F1 12 Tf ${item.x} ${item.y} Td (${item.text}) Tj ET`).join('\n')
        ).join('\n');
        
        pdfContent += '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
        pdfContent += '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
        pdfContent += '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n';
        pdfContent += '4 0 obj\n<< /Length ' + pageContent.length + ' >>\nstream\n' + pageContent + '\nendstream\nendobj\n';
        pdfContent += 'xref\n0 5\n0000000000 65535 f\n0000000010 00000 n\n0000000079 00000 n\n0000000173 00000 n\n0000000301 00000 n\n';
        pdfContent += 'trailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n' + (pdfContent.length + 1) + '\n%%EOF';
        
        return pdfContent;
      }
    };
  };

  const addComplaintContent = async (pdfDoc: any, complaint: Complaint) => {
    pdfDoc.addPage();
    
    let yPosition = 750;
    const lineHeight = 20;
    const leftMargin = 50;
    
    // Titre
    pdfDoc.text("Rapport de Plainte", leftMargin, yPosition);
    yPosition -= lineHeight * 2;
    
    // Informations du demandeur
    pdfDoc.text("DEMANDEUR:", leftMargin, yPosition);
    yPosition -= lineHeight;
    pdfDoc.text(`Nom: ${complaint.plaintiff_first_name} ${complaint.plaintiff_last_name}`, leftMargin + 20, yPosition);
    yPosition -= lineHeight;
    pdfDoc.text(`Date: ${complaint.complaint_date}`, leftMargin + 20, yPosition);
    yPosition -= lineHeight;
    pdfDoc.text(`Ville: ${complaint.complaint_city}`, leftMargin + 20, yPosition);
    yPosition -= lineHeight * 2;
    
    // Informations du défendeur
    pdfDoc.text("DEFENDEUR:", leftMargin, yPosition);
    yPosition -= lineHeight;
    if (complaint.defendant_unknown) {
      pdfDoc.text("Statut: Inconnu", leftMargin + 20, yPosition);
    } else {
      pdfDoc.text(`Nom: ${complaint.defendant_first_name} ${complaint.defendant_last_name}`, leftMargin + 20, yPosition);
      yPosition -= lineHeight;
      if (complaint.defendant_birth_date) {
        pdfDoc.text(`Date de naissance: ${complaint.defendant_birth_date}`, leftMargin + 20, yPosition);
        yPosition -= lineHeight;
      }
      if (complaint.defendant_birth_place) {
        pdfDoc.text(`Lieu de naissance: ${complaint.defendant_birth_place}`, leftMargin + 20, yPosition);
        yPosition -= lineHeight;
      }
      if (complaint.defendant_nationality) {
        pdfDoc.text(`Nationalité: ${complaint.defendant_nationality}`, leftMargin + 20, yPosition);
        yPosition -= lineHeight;
      }
      if (complaint.defendant_address) {
        pdfDoc.text(`Adresse: ${complaint.defendant_address}`, leftMargin + 20, yPosition);
        yPosition -= lineHeight;
      }
    }
    yPosition -= lineHeight * 2;
    
    // Avocat
    if (complaint.lawyer_name) {
      pdfDoc.text("AVOCAT:", leftMargin, yPosition);
      yPosition -= lineHeight;
      pdfDoc.text(`Nom: ${complaint.lawyer_name}`, leftMargin + 20, yPosition);
      yPosition -= lineHeight;
      if (complaint.lawyer_address) {
        pdfDoc.text(`Adresse: ${complaint.lawyer_address}`, leftMargin + 20, yPosition);
        yPosition -= lineHeight;
      }
      yPosition -= lineHeight;
    }
    
    // Soumission
    pdfDoc.text("SOUMISSION:", leftMargin, yPosition);
    yPosition -= lineHeight;
    pdfDoc.text(`Soumis par: ${complaint.submitted_by?.username || 'Utilisateur anonyme'}`, leftMargin + 20, yPosition);
    yPosition -= lineHeight * 2;
    
    // Faits de la plainte
    pdfDoc.text("FAITS DE LA PLAINTES:", leftMargin, yPosition);
    yPosition -= lineHeight;
    
    // Diviser le texte en lignes pour éviter les dépassements
    const factsLines = wrapText(complaint.facts, 80);
    factsLines.forEach(line => {
      if (yPosition > 50) {
        pdfDoc.text(line, leftMargin + 20, yPosition);
        yPosition -= lineHeight;
      } else {
        // Nouvelle page si nécessaire
        pdfDoc.addPage();
        yPosition = 750;
        pdfDoc.text(line, leftMargin + 20, yPosition);
        yPosition -= lineHeight;
      }
    });
    
    // Pièces jointes
    if (attachments.length > 0) {
      yPosition -= lineHeight;
      pdfDoc.text("PIECES JOINTES:", leftMargin, yPosition);
      yPosition -= lineHeight;
      attachments.forEach((attachment, index) => {
        if (yPosition > 50) {
          pdfDoc.text(`- ${attachment.file_name || `Pièce ${index + 1}`}`, leftMargin + 20, yPosition);
          yPosition -= lineHeight;
        } else {
          pdfDoc.addPage();
          yPosition = 750;
          pdfDoc.text(`- ${attachment.file_name || `Pièce ${index + 1}`}`, leftMargin + 20, yPosition);
          yPosition -= lineHeight;
        }
      });
    }
  };

  const wrapText = (text: string, maxLength: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    words.forEach(word => {
      if ((currentLine + word).length <= maxLength) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
  };

  const downloadPDF = async (pdfDoc: any, filename: string) => {
    const pdfContent = pdfDoc.save();
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportTextFallback = () => {
    const complaintData = {
      plaintiff: `${complaint.plaintiff_first_name} ${complaint.plaintiff_last_name}`,
      facts: complaint.facts,
      date: complaint.complaint_date,
      city: complaint.complaint_city,
      defendant: complaint.defendant_unknown ? 'Unknown' : `${complaint.defendant_first_name} ${complaint.defendant_last_name}`,
      lawyer: complaint.lawyer_name || 'N/A',
      submittedBy: complaint.submitted_by?.username || 'Anonymous'
    };
    
    const content = `RAPPORT DE PLAINTES\n\n` +
      `=================\n\n` +
      `DEMANDEUR:\n` +
      `Nom: ${complaintData.plaintiff}\n` +
      `Date: ${complaintData.date}\n` +
      `Ville: ${complaintData.city}\n\n` +
      `DEFENDEUR:\n` +
      `Statut: ${complaint.defendant_unknown ? 'Inconnu' : complaintData.defendant}\n` +
      `${complaint.defendant_birth_date ? `Date de naissance: ${complaint.defendant_birth_date}\n` : ''}` +
      `${complaint.defendant_birth_place ? `Lieu de naissance: ${complaint.defendant_birth_place}\n` : ''}` +
      `${complaint.defendant_nationality ? `Nationalité: ${complaint.defendant_nationality}\n` : ''}` +
      `${complaint.defendant_address ? `Adresse: ${complaint.defendant_address}\n` : ''}` +
      `${complaint.defendant_city ? `Ville: ${complaint.defendant_city}\n` : ''}` +
      `${complaint.defendant_postal_code ? `Code postal: ${complaint.defendant_postal_code}\n` : ''}\n` +
      `${complaint.lawyer_name ? `AVOCAT:\nNom: ${complaint.lawyer_name}\n${complaint.lawyer_address ? `Adresse: ${complaint.lawyer_address}\n` : ''}` : ''}` +
      `SOUMISSION:\n` +
      `Soumis par: ${complaintData.submittedBy}\n\n` +
      `FAITS DE LA PLAINTES:\n` +
      `${'='.repeat(50)}\n` +
      `${complaintData.facts}\n\n` +
      `${attachments.length > 0 ? `PIECES JOINTES:\n${attachments.map((a, i) => `- ${a.file_name || `Pièce ${i + 1}`}`).join('\n')}` : ''}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plainte_${complaint.id || 'unknown'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ✅ ici attachments est bien typé
  const attachments: Attachment[] = complaint.attachments || [];
  const unreadCount = complaint.unread_messages_count || 0;

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
        <div className="ml-4 flex gap-2 flex-shrink-0">
          {complaint.id && (
            <button
              onClick={() => setIsMessagesOpen(true)}
              className="relative bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Messages</span>
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          )}
          <button
            onClick={() => exportToPDF()}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Download className="h-4 w-4" />
            <span>Exporter</span>
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <span>{isExpanded ? "Masquer les détails" : "Voir les détails"}</span>
          </button>
        </div>
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

      {/* Messages Modal */}
      {complaint.id && (
        <ComplaintMessages
          complaintId={complaint.id}
          complaintTitle={`Plainte de ${complaint.plaintiff_first_name} ${complaint.plaintiff_last_name}`}
          isOpen={isMessagesOpen}
          onClose={() => setIsMessagesOpen(false)}
        />
      )}
    </div>
  );
};
