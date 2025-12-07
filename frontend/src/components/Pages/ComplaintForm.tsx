import React, { useState, useRef, useEffect } from "react";
import { 
  Shield, 
  User, 
  Scale, 
  FileText, 
  Paperclip, 
  Send, 
  Calendar,
  MapPin,
  Building,
  Mail,
  Globe,
  UserCheck,
  X,
  CheckCircle,
  Volume2,
  ChevronRight,
  ChevronLeft,
  Bot,
  VolumeX,
  Play,
  Pause,
  RefreshCw
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { apiService } from "../../services/api";

interface ComplaintFormProps {
  onPageChange?: (page: string) => void;
}

type FormStep = 1 | 2 | 3 | 4;

export const ComplaintForm: React.FC<ComplaintFormProps> = ({ onPageChange }) => {
  const { language } = useLanguage();
  
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasLawyer, setHasLawyer] = useState(false);
  
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

  // État pour l'assistant vocal
  const [isAssistantActive, setIsAssistantActive] = useState(true);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState('');
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Gestion des changements
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
    const { name, value } = e.target;
    setComplaint({ ...complaint, [name]: value });
    
    // Afficher les champs avocat si le nom est renseigné
    if (name === "lawyerName" && value.trim() !== "") {
      setHasLawyer(true);
    } else if (name === "lawyerName" && value.trim() === "" && complaint.lawyerAddress.trim() === "") {
      setHasLawyer(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  // Fonction pour lire le texte (accessibilité)
  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'fr' ? 'fr-FR' : 'wo-SN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Fonction pour parler avec l'assistant vocal
  const speakWithAssistant = (text: string, autoPlay: boolean = true) => {
    if (!isAssistantActive || !('speechSynthesis' in window)) return;
    
    // Arrêter toute parole en cours
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'fr' ? 'fr-FR' : 'wo-SN';
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onstart = () => {
      setIsAssistantSpeaking(true);
      setAssistantMessage(text);
    };
    
    utterance.onend = () => {
      setIsAssistantSpeaking(false);
      setAssistantMessage('');
    };
    
    utterance.onerror = () => {
      setIsAssistantSpeaking(false);
      setAssistantMessage('');
    };
    
    speechSynthesisRef.current = utterance;
    
    if (autoPlay) {
      window.speechSynthesis.speak(utterance);
    }
  };

  // Arrêter l'assistant vocal
  const stopAssistant = () => {
    window.speechSynthesis.cancel();
    setIsAssistantSpeaking(false);
    setAssistantMessage('');
  };

  // Répéter le dernier message
  const repeatAssistant = () => {
    if (assistantMessage) {
      speakWithAssistant(assistantMessage);
    }
  };

  // Messages de l'assistant selon l'étape
  const getAssistantMessage = (): string => {
    if (currentStep === 1) {
      return language === 'fr' 
        ? 'Déposez votre plainte facilement et en toute sécurité. Remplissez les informations du plaignant : prénom, nom, date de naissance, lieu de naissance, nationalité, adresse, ville et code postal. Tous les champs sont obligatoires.'
        : 'Deposeal sa jëf bi ci kumpa. Feesal xibaar bu jëfandikoo : tur bu jëkk, tur, beesu génnes, bër bu génnes, réew, bër, dëkk ak koodu post. Dëkk yépp am solo.';
    }
    
    if (currentStep === 2) {
      if (defendant.unknown) {
        return language === 'fr'
          ? 'Vous avez choisi "Auteur inconnu (contre X)". Vous pouvez passer à l\'étape suivante.'
          : 'Tànn naa "Kooku xamul (ci X)". Mën nga jëkk ci étape bi ci topp.';
      } else {
        return language === 'fr'
          ? 'Remplissez les informations de l\'auteur présumé. Si vous ne connaissez pas l\'auteur, vous pouvez cocher "Auteur inconnu (contre X)". Les champs prénom et nom sont obligatoires si l\'auteur est connu.'
          : 'Feesal xibaar ci kooku jëfandikoo. Su xamuloo kooku, mën nga tànn "Kooku xamul (ci X)". Tur bu jëkk ak tur am solo su kooku xam la.';
      }
    }
    
    if (currentStep === 3) {
      let message = language === 'fr'
        ? 'Remplissez les détails de votre plainte. Décrivez les faits de manière claire et détaillée. Indiquez la date de la plainte et la ville où elle est rédigée. Si vous avez un avocat, vous pouvez ajouter ses informations.'
        : 'Feesal xët ci sa jëf bi. Wone jëf yi ci kumpa bu baax. Wax beesu jëf bi ak dëkk bu bind jëf bi. Su am nga avoka, mën nga yokk xibaar.';
      
      if (hasLawyer) {
        message += language === 'fr'
          ? ' Remplissez le nom et l\'adresse de votre avocat.'
          : ' Feesal tur ak bër bu sa avoka.';
      }
      
      return message;
    }
    
    if (currentStep === 4) {
      return language === 'fr'
        ? 'Vous pouvez ajouter des pièces jointes si nécessaire : images, PDF ou documents. C\'est optionnel. Vérifiez le résumé de votre plainte, puis cliquez sur "Envoyer la plainte" pour finaliser.'
        : 'Mën nga yokk pis si soxla : yoon, PDF mbaa dokument. Dëggu la. Seet xët ci sa jëf bi, gannaaw click ci "Yónnee jëf bi" ngir jeexal.';
    }
    
    return '';
  };

  // Parler automatiquement quand l'étape change
  useEffect(() => {
    if (isAssistantActive && currentStep) {
      const message = getAssistantMessage();
      if (message) {
        // Délai pour laisser l'interface se mettre à jour
        setTimeout(() => {
          speakWithAssistant(message);
        }, 500);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, defendant.unknown, hasLawyer, isAssistantActive]);

  // Message de confirmation après soumission
  useEffect(() => {
    if (showSuccess && isAssistantActive) {
      const successMessage = language === 'fr'
        ? 'Plainte envoyée avec succès. Merci pour votre contribution à la justice.'
        : 'Jëf bi yónnee na ci kumpa. Jërejëf ngir sa jëf ci justice.';
      setTimeout(() => {
        speakWithAssistant(successMessage);
      }, 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSuccess, isAssistantActive, language]);

  // Calcul de la progression
  const calculateProgress = (): number => {
    let completed = 0;
    let total = 0;

    // Step 1: Plaignant
    total += 8;
    if (plaintiff.firstName) completed++;
    if (plaintiff.lastName) completed++;
    if (plaintiff.birthDate) completed++;
    if (plaintiff.birthPlace) completed++;
    if (plaintiff.nationality) completed++;
    if (plaintiff.address) completed++;
    if (plaintiff.city) completed++;
    if (plaintiff.postalCode) completed++;

    // Step 2: Défendeur
    if (!defendant.unknown) {
      total += 8;
      if (defendant.firstName) completed++;
      if (defendant.lastName) completed++;
      if (defendant.birthDate) completed++;
      if (defendant.birthPlace) completed++;
      if (defendant.nationality) completed++;
      if (defendant.address) completed++;
      if (defendant.city) completed++;
      if (defendant.postalCode) completed++;
    } else {
      total += 1;
      completed += 1;
    }

    // Step 3: Détails
    total += 4;
    if (complaint.facts) completed++;
    if (complaint.date) completed++;
    if (complaint.city) completed++;
    if (hasLawyer ? (complaint.lawyerName && complaint.lawyerAddress) : true) completed++;

    return Math.round((completed / total) * 100);
  };

  // Validation des étapes
  const canProceedToStep = (step: FormStep): boolean => {
    switch (step) {
      case 2:
        return !!(plaintiff.firstName && plaintiff.lastName && plaintiff.birthDate && 
                  plaintiff.birthPlace && plaintiff.nationality && plaintiff.address && 
                  plaintiff.city && plaintiff.postalCode);
      case 3:
        return defendant.unknown || !!(defendant.firstName && defendant.lastName);
      case 4:
        return !!(complaint.facts && complaint.date && complaint.city);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < 4 && canProceedToStep((currentStep + 1) as FormStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4) as FormStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => Math.max(prev - 1, 1) as FormStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Soumission du formulaire
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const complaintData = {
      facts: complaint.facts,
        lawyer_name: complaint.lawyerName || undefined,
        lawyer_address: complaint.lawyerAddress || undefined,
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
        defendant_first_name: defendant.unknown ? undefined : defendant.firstName,
        defendant_last_name: defendant.unknown ? undefined : defendant.lastName,
        defendant_birth_date: defendant.unknown ? undefined : defendant.birthDate,
        defendant_birth_place: defendant.unknown ? undefined : defendant.birthPlace,
        defendant_nationality: defendant.unknown ? undefined : defendant.nationality,
        defendant_address: defendant.unknown ? undefined : defendant.address,
        defendant_city: defendant.unknown ? undefined : defendant.city,
        defendant_postal_code: defendant.unknown ? undefined : defendant.postalCode,
      defendant_unknown: defendant.unknown,
    };

    await apiService.createComplaint(complaintData, attachments);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
    if (onPageChange) onPageChange("home");
      }, 3000);

  } catch (err: any) {
    console.error(err);
      alert(`❌ ${language === 'fr' ? 'Erreur lors de l\'envoi de la plainte' : 'Jëfandikoo ci yónneesug jëf bi'}: ${err.message}`);
  } finally {
    setLoading(false);
  }
};

  // Traductions
  const translations = {
    fr: {
      title: "Déposer une plainte",
      subtitle: "Soumettez votre plainte facilement et en toute sécurité sur Jubbalnet",
      step1: "Informations du plaignant",
      step2: "Auteur présumé",
      step3: "Détails de la plainte",
      step4: "Pièces jointes & Envoi",
      progress: "Progression",
      next: "Suivant",
      previous: "Précédent",
      submit: "Envoyer la plainte",
      loading: "Envoi en cours...",
      success: "Plainte envoyée avec succès !",
      firstName: "Prénom",
      lastName: "Nom",
      birthDate: "Date de naissance",
      birthPlace: "Lieu de naissance",
      nationality: "Nationalité",
      address: "Adresse",
      city: "Ville",
      postalCode: "Code postal",
      unknown: "Auteur inconnu (contre X)",
      facts: "Exposer les faits de la plainte",
      lawyerName: "Nom de l'avocat (optionnel)",
      lawyerAddress: "Adresse de l'avocat",
      complaintDate: "Date de la plainte",
      complaintCity: "Ville où la plainte est rédigée",
      attachments: "Pièces jointes",
      noAttachments: "Aucune pièce jointe ajoutée",
      addFiles: "Ajouter des fichiers",
      listen: "Écouter",
    },
    wo: {
      title: "Porter plainte",
      subtitle: "Deposeal sa plainte ci Jubbalnet bu ñuul",
      step1: "Xibaar bu jëfandikoo",
      step2: "Kooku jëfandikoo",
      step3: "Xët ci jëf bi",
      step4: "Pis ak Yónne",
      progress: "Daje",
      next: "Ci topp",
      previous: "Ci ginaw",
      submit: "Yónnee jëf bi",
      loading: "Yónne daje...",
      success: "Jëf bi yónnee!",
      firstName: "Tur bu jëkk",
      lastName: "Tur",
      birthDate: "Beesu génnes",
      birthPlace: "Bër bu génnes",
      nationality: "Réew",
      address: "Bër",
      city: "Dëkk",
      postalCode: "Koodu post",
      unknown: "Kooku xamul (ci X)",
      facts: "Wone jëf yi",
      lawyerName: "Tur bu avoka (dëggu)",
      lawyerAddress: "Bër bu avoka",
      complaintDate: "Beesu jëf bi",
      complaintCity: "Dëkk bu bind jëf bi",
      attachments: "Pis",
      noAttachments: "Pis dëggu",
      addFiles: "Yokk fiyee",
      listen: "Dégg",
    },
  };

  const t = translations[language];

  // Animation de succès
  if (showSuccess) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center animate-fade-in">
          <div className="mb-6 flex justify-center">
            <div className="bg-green-100 p-6 rounded-full animate-bounce">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ✅ {t.success}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === 'fr' 
              ? 'Votre plainte a été enregistrée avec succès. Vous serez redirigé...'
              : 'Sa jëf bi dëkku na. Dinaa la yónnee...'}
          </p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-gradient-to-br from-green-900 via-green-800 to-green-900 text-white py-12 shadow-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white bg-opacity-20 backdrop-blur-md p-6 rounded-3xl shadow-2xl inline-block mb-6 animate-fade-in">
            <Shield className="h-16 w-16 text-white mx-auto" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-slide-down">
            {t.title}
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto animate-fade-in">
            {t.subtitle}
          </p>
        </div>
      </header>

      {/* Assistant Vocal - Widget flottant */}
      {isAssistantActive && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-2xl p-4 max-w-sm border-2 border-white border-opacity-20">
            {/* En-tête de l'assistant */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`bg-white bg-opacity-20 p-2 rounded-full ${isAssistantSpeaking ? 'animate-pulse' : ''}`}>
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">
                    {language === 'fr' ? 'Assistant Vocal' : 'Assistant ci Baat'}
                  </h3>
                  <p className="text-white text-xs opacity-80">
                    {isAssistantSpeaking 
                      ? (language === 'fr' ? 'En train de parler...' : 'Ci wax...')
                      : (language === 'fr' ? 'En attente' : 'Ci xët')
                    }
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAssistantActive(false);
                  stopAssistant();
                }}
                className="text-white hover:text-gray-200 transition-colors p-1"
                title={language === 'fr' ? 'Désactiver' : 'Bañ'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message de l'assistant */}
            {assistantMessage && (
              <div className="bg-white bg-opacity-10 rounded-lg p-3 mb-3 backdrop-blur-sm">
                <p className="text-white text-sm leading-relaxed">
                  {assistantMessage}
                </p>
              </div>
            )}

            {/* Contrôles */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={isAssistantSpeaking ? stopAssistant : () => speakWithAssistant(getAssistantMessage())}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  isAssistantSpeaking
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white'
                }`}
              >
                {isAssistantSpeaking ? (
                  <>
                    <Pause className="w-4 h-4" />
                    {language === 'fr' ? 'Pause' : 'Dëgg'}
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    {language === 'fr' ? 'Écouter' : 'Dégg'}
                  </>
                )}
              </button>
              
              {assistantMessage && (
                <button
                  type="button"
                  onClick={repeatAssistant}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition-all"
                  title={language === 'fr' ? 'Répéter' : 'Waxaat'}
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bouton pour réactiver l'assistant */}
      {!isAssistantActive && (
        <button
          type="button"
          onClick={() => {
            setIsAssistantActive(true);
            const message = getAssistantMessage();
            if (message) {
              setTimeout(() => speakWithAssistant(message), 300);
            }
          }}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform animate-fade-in"
          title={language === 'fr' ? 'Activer l\'assistant vocal' : 'Jëfandikoo assistant ci baat'}
        >
          <VolumeX className="w-6 h-6" />
        </button>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
        {/* Barre de progression */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-slide-down">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-700">{t.progress}</span>
            <span className="text-sm font-bold text-blue-600">{calculateProgress()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
          
          {/* Indicateurs d'étapes */}
          <div className="flex justify-between mt-6">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex flex-col items-center flex-1 ${
                  step <= currentStep ? 'opacity-100' : 'opacity-40'
                } transition-opacity duration-300`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    step < currentStep
                      ? 'bg-green-500'
                      : step === currentStep
                      ? 'bg-blue-600 ring-4 ring-blue-200'
                      : 'bg-gray-300'
                  } transition-all duration-300`}
                >
                  {step < currentStep ? <CheckCircle className="w-6 h-6" /> : step}
                </div>
                <span className="text-xs mt-2 text-center font-medium text-gray-700">
                  {step === 1 && t.step1}
                  {step === 2 && t.step2}
                  {step === 3 && t.step3}
                  {step === 4 && t.step4}
                </span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Étape 1: Informations du plaignant */}
          <div
            className={`bg-white rounded-2xl shadow-xl p-8 border-l-4 border-blue-600 transition-all duration-500 ${
              currentStep === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 hidden'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-4 rounded-xl">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    {t.step1}
                    <button
                      type="button"
                      onClick={() => playAudio(t.step1)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title={t.listen}
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {language === 'fr' 
                      ? 'Remplissez vos informations personnelles'
                      : 'Sëtt xibaar yi'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  {t.firstName}
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={plaintiff.firstName}
                  onChange={handleChangePlaintiff}
                  placeholder={t.firstName}
                  required
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg"
                />
                <User className="w-5 h-5 text-gray-400 absolute left-4 top-11" />
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  {t.lastName}
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={plaintiff.lastName}
                  onChange={handleChangePlaintiff}
                  placeholder={t.lastName}
                  required
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg"
                />
                <UserCheck className="w-5 h-5 text-gray-400 absolute left-4 top-11" />
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  {t.birthDate}
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={plaintiff.birthDate}
                  onChange={handleChangePlaintiff}
                  required
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg"
                />
                <Calendar className="w-5 h-5 text-gray-400 absolute left-4 top-11" />
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  {t.birthPlace}
                </label>
                <input
                  type="text"
                  name="birthPlace"
                  value={plaintiff.birthPlace}
                  onChange={handleChangePlaintiff}
                  placeholder={t.birthPlace}
                  required
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg"
                />
                <MapPin className="w-5 h-5 text-gray-400 absolute left-4 top-11" />
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  {t.nationality}
                </label>
                <input
                  type="text"
                  name="nationality"
                  value={plaintiff.nationality}
                  onChange={handleChangePlaintiff}
                  placeholder={t.nationality}
                  required
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg"
                />
                <Globe className="w-5 h-5 text-gray-400 absolute left-4 top-11" />
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-600" />
                  {t.address}
                </label>
                <input
                  type="text"
                  name="address"
                  value={plaintiff.address}
                  onChange={handleChangePlaintiff}
                  placeholder={t.address}
                  required
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg"
                />
                <Building className="w-5 h-5 text-gray-400 absolute left-4 top-11" />
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  {t.city}
                </label>
                <input
                  type="text"
                  name="city"
                  value={plaintiff.city}
                  onChange={handleChangePlaintiff}
                  placeholder={t.city}
                  required
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg"
                />
                <MapPin className="w-5 h-5 text-gray-400 absolute left-4 top-11" />
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  {t.postalCode}
                </label>
            <input
                  type="text"
                  name="postalCode"
                  value={plaintiff.postalCode}
              onChange={handleChangePlaintiff}
                  placeholder={t.postalCode}
                  required
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg"
                />
                <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-11" />
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                type="button"
                onClick={nextStep}
                disabled={!canProceedToStep(2)}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
              >
                {t.next} <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Étape 2: Auteur présumé */}
          <div
            className={`bg-white rounded-2xl shadow-xl p-8 border-l-4 border-yellow-500 transition-all duration-500 ${
              currentStep === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 hidden'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-100 p-4 rounded-xl">
                  <Scale className="w-8 h-8 text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    {t.step2}
                    <button
                      type="button"
                      onClick={() => playAudio(t.step2)}
                      className="text-yellow-600 hover:text-yellow-800 transition-colors"
                      title={t.listen}
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {language === 'fr' 
                      ? 'Informations sur la personne mise en cause'
                      : 'Xibaar ci kooku jëfandikoo'}
                  </p>
                </div>
              </div>
        </div>

            <div className="mb-6">
              <label className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200 cursor-pointer hover:bg-yellow-100 transition-colors">
          <input
            type="checkbox"
            name="unknown"
            checked={defendant.unknown}
            onChange={handleChangeDefendant}
                  className="w-5 h-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
          />
                <span className="text-lg font-semibold text-gray-900">{t.unknown}</span>
        </label>
            </div>

        {!defendant.unknown && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-yellow-600" />
                    {t.firstName}
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={defendant.firstName}
                    onChange={handleChangeDefendant}
                    placeholder={t.firstName}
                    className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-xl focus:border-yellow-600 focus:ring-2 focus:ring-yellow-200 transition-all duration-200 text-lg"
                  />
                  <User className="w-5 h-5 text-gray-400 absolute left-4 top-11" />
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-yellow-600" />
                    {t.lastName}
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={defendant.lastName}
                    onChange={handleChangeDefendant}
                    placeholder={t.lastName}
                    className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-xl focus:border-yellow-600 focus:ring-2 focus:ring-yellow-200 transition-all duration-200 text-lg"
                  />
                  <UserCheck className="w-5 h-5 text-gray-400 absolute left-4 top-11" />
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-yellow-600" />
                    {t.birthDate}
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={defendant.birthDate}
                    onChange={handleChangeDefendant}
                    className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-xl focus:border-yellow-600 focus:ring-2 focus:ring-yellow-200 transition-all duration-200 text-lg"
                  />
                  <Calendar className="w-5 h-5 text-gray-400 absolute left-4 top-11" />
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-yellow-600" />
                    {t.birthPlace}
                  </label>
                  <input
                    type="text"
                    name="birthPlace"
                    value={defendant.birthPlace}
                    onChange={handleChangeDefendant}
                    placeholder={t.birthPlace}
                    className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-xl focus:border-yellow-600 focus:ring-2 focus:ring-yellow-200 transition-all duration-200 text-lg"
                  />
                  <MapPin className="w-5 h-5 text-gray-400 absolute left-4 top-11" />
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-yellow-600" />
                    {t.nationality}
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    value={defendant.nationality}
                    onChange={handleChangeDefendant}
                    placeholder={t.nationality}
                    className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-xl focus:border-yellow-600 focus:ring-2 focus:ring-yellow-200 transition-all duration-200 text-lg"
                  />
                  <Globe className="w-5 h-5 text-gray-400 absolute left-4 top-11" />
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Building className="w-4 h-4 text-yellow-600" />
                    {t.address}
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={defendant.address}
                    onChange={handleChangeDefendant}
                    placeholder={t.address}
                    className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-xl focus:border-yellow-600 focus:ring-2 focus:ring-yellow-200 transition-all duration-200 text-lg"
                  />
                  <Building className="w-5 h-5 text-gray-400 absolute left-4 top-11" />
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-yellow-600" />
                    {t.city}
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={defendant.city}
                    onChange={handleChangeDefendant}
                    placeholder={t.city}
                    className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-xl focus:border-yellow-600 focus:ring-2 focus:ring-yellow-200 transition-all duration-200 text-lg"
                  />
                  <MapPin className="w-5 h-5 text-gray-400 absolute left-4 top-11" />
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-yellow-600" />
                    {t.postalCode}
                  </label>
              <input
                    type="text"
                    name="postalCode"
                    value={defendant.postalCode}
                onChange={handleChangeDefendant}
                    placeholder={t.postalCode}
                    className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-xl focus:border-yellow-600 focus:ring-2 focus:ring-yellow-200 transition-all duration-200 text-lg"
              />
                  <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-11" />
                </div>
          </div>
        )}

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
              >
                <ChevronLeft className="w-5 h-5" /> {t.previous}
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!canProceedToStep(3)}
                className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
              >
                {t.next} <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Étape 3: Détails de la plainte */}
          <div
            className={`bg-white rounded-2xl shadow-xl p-8 border-l-4 border-orange-500 transition-all duration-500 ${
              currentStep === 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 hidden'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="bg-orange-100 p-4 rounded-xl">
                  <FileText className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    {t.step3}
                    <button
                      type="button"
                      onClick={() => playAudio(t.step3)}
                      className="text-orange-600 hover:text-orange-800 transition-colors"
                      title={t.listen}
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {language === 'fr' 
                      ? 'Décrivez les faits de votre plainte'
                      : 'Wone jëf yi ci sa jëf bi'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-600" />
                  {t.facts}
                </label>
        <textarea
          name="facts"
          value={complaint.facts}
          onChange={handleChangeComplaint}
                  placeholder={t.facts}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-lg resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    {t.complaintDate}
                  </label>
          <input
            type="date"
            name="date"
            value={complaint.date}
            onChange={handleChangeComplaint}
                    required
                    className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-xl focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-lg"
                  />
                  <Calendar className="w-5 h-5 text-gray-400 absolute left-4 top-11" />
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    {t.complaintCity}
                  </label>
          <input
            type="text"
            name="city"
            value={complaint.city}
            onChange={handleChangeComplaint}
                    placeholder={t.complaintCity}
                    required
                    className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-xl focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-lg"
                  />
                  <MapPin className="w-5 h-5 text-gray-400 absolute left-4 top-11" />
                </div>
              </div>

              {/* Champs avocat conditionnels */}
              <div className="border-t pt-6">
                <label className="flex items-center space-x-3 mb-4">
                  <input
                    type="checkbox"
                    checked={hasLawyer}
                    onChange={(e) => {
                      setHasLawyer(e.target.checked);
                      if (!e.target.checked) {
                        setComplaint({ ...complaint, lawyerName: '', lawyerAddress: '' });
                      }
                    }}
                    className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-lg font-semibold text-gray-900">
                    {language === 'fr' ? 'Ajouter les informations de mon avocat' : 'Yokk xibaar ci sa avoka'}
                  </span>
                </label>

                {hasLawyer && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    <div className="relative">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-orange-600" />
                        {t.lawyerName}
                      </label>
                      <input
                        type="text"
                        name="lawyerName"
                        value={complaint.lawyerName}
                        onChange={handleChangeComplaint}
                        placeholder={t.lawyerName}
                        className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-xl focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-lg"
                      />
                      <User className="w-5 h-5 text-gray-400 absolute left-4 top-11" />
        </div>

                    <div className="relative">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Building className="w-4 h-4 text-orange-600" />
                        {t.lawyerAddress}
          </label>
                      <input
                        type="text"
                        name="lawyerAddress"
                        value={complaint.lawyerAddress}
                        onChange={handleChangeComplaint}
                        placeholder={t.lawyerAddress}
                        className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-xl focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-lg"
                      />
                      <Building className="w-5 h-5 text-gray-400 absolute left-4 top-11" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
              >
                <ChevronLeft className="w-5 h-5" /> {t.previous}
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!canProceedToStep(4)}
                className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
              >
                {t.next} <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Étape 4: Pièces jointes & Envoi */}
          <div
            className={`bg-white rounded-2xl shadow-xl p-8 border-l-4 border-green-600 transition-all duration-500 ${
              currentStep === 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 hidden'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-4 rounded-xl">
                  <Paperclip className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    {t.step4}
                    <button
                      type="button"
                      onClick={() => playAudio(t.step4)}
                      className="text-green-600 hover:text-green-800 transition-colors"
                      title={t.listen}
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {language === 'fr' 
                      ? 'Ajoutez des documents si nécessaire'
                      : 'Yokk dokumentoog si soxla'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Paperclip className="w-5 h-5 text-green-600" />
                  {t.attachments}
                </label>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 transition-colors cursor-pointer">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Paperclip className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium mb-2">{t.addFiles}</p>
                    <p className="text-sm text-gray-500">
                      {language === 'fr' 
                        ? 'Images, PDF, documents (max 10MB par fichier)'
                        : 'Yoon, PDF, dokument (max 10MB ci fiyee'}
                    </p>
                  </label>
                </div>

                {attachments.length === 0 ? (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl text-center">
                    <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">📁 {t.noAttachments}</p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-2">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200 animate-fade-in"
                      >
                        <div className="flex items-center space-x-3">
                          <Paperclip className="w-5 h-5 text-green-600" />
                          <span className="text-gray-800 font-medium">{file.name}</span>
                          <span className="text-sm text-gray-500">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
          )}
        </div>

              {/* Résumé */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {language === 'fr' ? 'Résumé de votre plainte' : 'Xët ci sa jëf bi'}
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>{language === 'fr' ? 'Plaignant:' : 'Jëfandikoo:'}</strong> {plaintiff.firstName} {plaintiff.lastName}</p>
                  <p><strong>{language === 'fr' ? 'Auteur présumé:' : 'Kooku jëfandikoo:'}</strong> {defendant.unknown ? t.unknown : `${defendant.firstName} ${defendant.lastName}`}</p>
                  <p><strong>{language === 'fr' ? 'Date:' : 'Bees:'}</strong> {complaint.date}</p>
                  <p><strong>{language === 'fr' ? 'Ville:' : 'Dëkk:'}</strong> {complaint.city}</p>
                  <p><strong>{language === 'fr' ? 'Pièces jointes:' : 'Pis:'}</strong> {attachments.length}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
              >
                <ChevronLeft className="w-5 h-5" /> {t.previous}
              </button>
        <button
          type="submit"
                disabled={loading || !canProceedToStep(4)}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-12 py-4 rounded-xl font-bold shadow-xl transition-all duration-200 flex items-center gap-3 transform hover:scale-105 text-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {t.loading}
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6" />
                    {t.submit}
                  </>
                )}
        </button>
            </div>
      </div>
    </form>
    </div>

      {/* Styles CSS pour les animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};
