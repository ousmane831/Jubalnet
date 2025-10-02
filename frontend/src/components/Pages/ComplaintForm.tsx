import { Shield } from "lucide-react";
import React, { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { apiService } from "../../services/api";

interface ComplaintFormProps {
  onPageChange?: (page: string) => void;
}

export const ComplaintForm: React.FC<ComplaintFormProps> = ({ onPageChange }) => {
  const [plaintiff, setPlaintiff] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    birthPlace: "",
    nationality: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [defendant, setDefendant] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    birthPlace: "",
    nationality: "",
    address: "",
    city: "",
    postalCode: "",
    unknown: false,
  });

  const [complaint, setComplaint] = useState({
    facts: "",
    lawyerName: "",
    lawyerAddress: "",
    date: new Date().toISOString().split("T")[0],
    city: "",
  });

  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  // --- gestion des changements ---
  const handleChangePlaintiff = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaintiff({ ...plaintiff, [e.target.name]: e.target.value });
  };

  const handleChangeDefendant = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setDefendant({
      ...defendant,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleChangeComplaint = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setComplaint({ ...complaint, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

// --- soumission formulaire ---
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const complaintData = {
      facts: complaint.facts,
      lawyer_name: complaint.lawyerName,
      lawyer_address: complaint.lawyerAddress,
      complaint_date: complaint.date,
      complaint_city: complaint.city,
      plaintiff_first_name: plaintiff.firstName,
      plaintiff_last_name: plaintiff.lastName,
      plaintiff_birth_date: plaintiff.birthDate,
      plaintiff_birth_place: plaintiff.birthPlace,
      plaintiff_nationality: plaintiff.nationality,
      plaintiff_address: plaintiff.address,
      plaintiff_city: plaintiff.city,
      plaintiff_postal_code: plaintiff.postalCode,
      defendant_first_name: defendant.firstName,
      defendant_last_name: defendant.lastName,
      defendant_birth_date: defendant.birthDate,
      defendant_birth_place: defendant.birthPlace,
      defendant_nationality: defendant.nationality,
      defendant_address: defendant.address,
      defendant_city: defendant.city,
      defendant_postal_code: defendant.postalCode,
      defendant_unknown: defendant.unknown,
    };

    await apiService.createComplaint(complaintData, attachments);

    alert("✅ Plainte envoyée avec succès !");
    setAttachments([]);
    if (onPageChange) onPageChange("home");

  } catch (err: any) {
    console.error(err);
    alert(`❌ Erreur lors de l'envoi de la plainte: ${err.message}`);
  } finally {
    setLoading(false);
  }
};

const { language } = useLanguage();
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

{/* === Header === */}
      <header className="bg-gradient-to-br from-green-600 via-green-700 to-yellow-600 text-white py-2 shadow-md">
        <div className="container mx-auto px-6 text-center">
          <div className="bg-white bg-opacity-20 backdrop-blur-md p-6 rounded-2xl shadow-lg inline-block mb-6">
            <Shield className="h-14 w-14 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {language === "fr" ? "Déposer une plainte" : "Porter plainte"}
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
            {language === "fr"
              ? "Soumettez votre plainte facilement et en toute sécurité sur Jubbalnet."
              : "Deposeal sa plainte ci Jubbalnet bu ñuul."}
          </p>
        </div>
      </header>


        <div className="my-10 bg-white p-8 rounded-lg shadow-lg">

    <form
      onSubmit={handleSubmit}
      className="space-y-10"
      encType="multipart/form-data"
    >

      {/* === Infos plaignant === */}
      <section>
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">
          👤 Informations du plaignant
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "firstName", label: "Prénom" },
            { name: "lastName", label: "Nom" },
            { name: "birthDate", label: "Date de naissance", type: "date" },
            { name: "birthPlace", label: "Lieu de naissance" },
            { name: "nationality", label: "Nationalité" },
            { name: "address", label: "Adresse" },
            { name: "city", label: "Ville" },
            { name: "postalCode", label: "Code postal" },
          ].map((field, i) => (
            <input
              key={i}
              type={field.type || "text"}
              name={field.name}
              value={(plaintiff as any)[field.name]}
              onChange={handleChangePlaintiff}
              placeholder={field.label}
              className="w-full p-2 border rounded"
            />
          ))}
        </div>
      </section>

      {/* === Infos défendeur === */}
      <section>
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">
          ⚖️ Informations de l'auteur présumé
        </h3>
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            name="unknown"
            checked={defendant.unknown}
            onChange={handleChangeDefendant}
            className="mr-2"
          />
          Auteur inconnu (contre X)
        </label>
        {!defendant.unknown && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "firstName", label: "Prénom" },
              { name: "lastName", label: "Nom" },
              { name: "birthDate", label: "Date de naissance", type: "date" },
              { name: "birthPlace", label: "Lieu de naissance" },
              { name: "nationality", label: "Nationalité" },
              { name: "address", label: "Adresse" },
              { name: "city", label: "Ville" },
              { name: "postalCode", label: "Code postal" },
            ].map((field, i) => (
              <input
                key={i}
                type={field.type || "text"}
                name={field.name}
                value={(defendant as any)[field.name]}
                onChange={handleChangeDefendant}
                placeholder={field.label}
                className="w-full p-2 border rounded"
              />
            ))}
          </div>
        )}
      </section>

      {/* === Détails plainte === */}
      <section>
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">
          📝 Détails de la plainte
        </h3>
        <textarea
          name="facts"
          value={complaint.facts}
          onChange={handleChangeComplaint}
          placeholder="Exposer les faits"
          className="w-full mb-4 p-2 border rounded h-32"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="lawyerName"
            value={complaint.lawyerName}
            onChange={handleChangeComplaint}
            placeholder="Nom de l'avocat"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="lawyerAddress"
            value={complaint.lawyerAddress}
            onChange={handleChangeComplaint}
            placeholder="Adresse de l'avocat"
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            name="date"
            value={complaint.date}
            onChange={handleChangeComplaint}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="city"
            value={complaint.city}
            onChange={handleChangeComplaint}
            placeholder="Ville où la plainte est rédigée"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Upload fichiers */}
        <div className="mt-6">
          <label className="block mb-2 font-semibold">
            📎 Pièces jointes (images, PDF…)
          </label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
          {attachments.length > 0 && (
            <ul className="mt-2 text-sm text-gray-600">
              {attachments.map((file, i) => (
                <li key={i}>• {file.name}</li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* BOUTON ENVOI */}
      <div className="text-center">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold shadow"
        >
          {loading ? "⏳ Envoi en cours..." : "🚀 Envoyer la plainte"}
        </button>
      </div>
    </form>
    </div>
    </div>
  );
};
