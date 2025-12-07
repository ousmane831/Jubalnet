import React, { useState, useRef, useEffect } from 'react';
import { ReportClassifier } from '../../utils/reportClassifier';
import { 
  FileText, 
  Mic, 
  MapPin, 
  Shield,
  Paperclip,
  Play,
  Pause,
  Square,
  RefreshCw,
  Send,
  CheckCircle,
  User,
  Calendar,
  Clock,
  Mail,
  Volume2,
  ChevronRight,
  ChevronLeft,
  X,
  DollarSign,
  Briefcase,
  MessageCircle,
  CreditCard,
  Zap,
  Home,
  HelpCircle,
  Map as MapIcon,
  Bot,
  VolumeX,
  Monitor,
  Badge
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { apiService } from '../../services/api';
import { CrimeCategory } from '../../types';

interface ReportPageProps {
  onPageChange: (page: string) => void;
}

type ReportMode = 'written' | 'voice' | 'anonymous';
type FormStep = 1 | 2 | 3 | 4 | 5 | 6;

export const ReportPage: React.FC<ReportPageProps> = ({ onPageChange }) => {
  const { language } = useLanguage();
  
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [reportMode, setReportMode] = useState<ReportMode | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<{lat: number; lng: number} | null>(null);
  const [otherCrimeSpecification, setOtherCrimeSpecification] = useState('');
  const [categories, setCategories] = useState<CrimeCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAuthority, setSelectedAuthority] = useState<any>(null);
  const [authorityCategories, setAuthorityCategories] = useState<CrimeCategory[]>([]);
  
  // État pour l'assistant vocal
  const [isAssistantActive, setIsAssistantActive] = useState(true);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState('');
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    location: '',
    region: 'Dakar',
    date: '',
    time: '',
    contactAllowed: true,
    files: [] as File[],
  });

  const senegalRegions = [
    'Dakar', 'Thiès', 'Saint-Louis', 'Diourbel', 'Louga', 'Fatick',
    'Kaolack', 'Kolda', 'Ziguinchor', 'Tambacounda', 'Kaffrine',
    'Kédougou', 'Matam', 'Sédhiou'
  ];

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await apiService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    };
    
    loadCategories();
  }, []);

  // Redéterminer l'autorité quand la catégorie ou la région change
  useEffect(() => {
    if (formData.category && formData.region) {
      // TODO: Implement authority redirection logic
      setSelectedAuthority(null);
    }
  }, [formData.category, formData.region, formData.description]);

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

  // Messages de l'assistant selon l'étape et le mode
  const getAssistantMessage = (): string => {
    if (currentStep === 1) {
      return language === 'fr' 
        ? 'Signalez un crime ou un incident en toute sécurité. Choisissez le mode : Écrit, Vocal, ou Anonyme.'
        : 'Xamal krim mbaa insidan ci kumpa. Tànn mode : Bind, Baat, walla Sutura.';
    }
    
    if (currentStep === 2) {
      if (reportMode === 'voice') {
        return language === 'fr'
          ? 'Enregistrez votre signalement vocalement. Cliquez sur le bouton pour commencer. Après l\'enregistrement, votre signalement sera directement envoyé.'
          : 'Enregistrer sa baxal ak baat. Click ci bouton bi ngir tambali. Gannaaw enregistrement bi, sa baxal bi dina yónnee ci bépp.';
      } else if (reportMode === 'written') {
        return language === 'fr'
          ? 'Sélectionnez la catégorie de crime qui correspond à votre signalement. Cliquez sur une carte pour choisir.'
          : 'Tànn mbind njub bi moom sa baxal bi. Click ci benn carte ngir tànn.';
      }
    }
    
    if (currentStep === 3 && reportMode !== 'voice') {
      return language === 'fr'
        ? 'Remplissez les détails de votre signalement : titre, description, région, date et heure. Tous les champs marqués d\'un astérisque sont obligatoires.'
        : 'Feesal xët ci sa baxal bi : ndongo, xalaat, réegion, bees ak waxtu. Dëkk yépp bu am asterisk daf am solo.';
    }
    
    if (currentStep === 4 && reportMode !== 'voice') {
      return language === 'fr'
        ? 'Vous pouvez ajouter des pièces jointes si nécessaire : images, vidéos ou documents. C\'est optionnel, vous pouvez passer cette étape.'
        : 'Mën nga yokk pis si soxla : nataal, vidéo mbaa dokument. Dëggu la, mën nga jëkk ci étape bi.';
    }
    
    if (currentStep === 5 && reportMode !== 'voice') {
      return language === 'fr'
        ? 'Autorisez-vous les autorités à vous contacter pour des informations complémentaires ? Activez ou désactivez cette option selon votre préférence.'
        : 'Mën nga jaayoo autorités yi jokkoo ngir xibaar yu ëpp ? Jëfandikoo walla bañ ci option bi ci sa tànk.';
    }
    
    if (currentStep === 6) {
      if (reportMode === 'voice') {
        return language === 'fr'
          ? 'Vérifiez votre enregistrement vocal. Si tout est correct, cliquez sur Soumettre pour envoyer votre signalement.'
          : 'Seet sa enregistrement ci baat. Su dëgg la, click ci Yónnee ngir yónnee sa baxal bi.';
      } else {
        return language === 'fr'
          ? 'Vérifiez tous les détails de votre signalement. Si tout est correct, cliquez sur Soumettre pour envoyer.'
          : 'Seet xët yépp ci sa baxal bi. Su dëgg la, click ci Yónnee ngir yónnee.';
      }
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
  }, [currentStep, reportMode, isAssistantActive]);

  // Message de confirmation après soumission
  useEffect(() => {
    if (showSuccess && isAssistantActive) {
      const successMessage = language === 'fr'
        ? 'Signalement envoyé avec succès. Merci pour votre contribution à la sécurité.'
        : 'Baxal bi yónnee na ci kumpa. Jërejëf ngir sa jëf ci sécurité.';
      setTimeout(() => {
        speakWithAssistant(successMessage);
      }, 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSuccess, isAssistantActive, language]);


  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert(language === 'fr' ? 'La géolocalisation n\'est pas supportée' : 'Géolocalisation ba amul support');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert(language === 'fr' ? 'Impossible d\'obtenir votre position' : 'Amuma ko gëna am sa bër');
      }
    );
  };

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      alert(language === 'fr' ? 'Impossible d\'accéder au microphone' : 'Amuma gëna jëfandikoo microphone bi');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const playAudio = (text?: string) => {
    if (text && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'fr' ? 'fr-FR' : 'wo-SN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      return;
    }
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setAudioUrl('');
    setRecordingDuration(0);
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...files].slice(0, 5)
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  // Calcul de la progression
  const calculateProgress = (): number => {
    // Pour le mode vocal, la progression est différente (étapes 1 -> 2 -> 6)
    if (reportMode === 'voice') {
      if (currentStep === 1) return 0;
      if (currentStep === 2) return audioBlob ? 90 : 30;
      if (currentStep === 6) return 100;
      return 0;
    }
    // Pour les autres modes (écrit, anonyme)
    if (currentStep === 1) return 0;
    if (currentStep === 2) return 20;
    if (currentStep === 3) return 40;
    if (currentStep === 4) return 60;
    if (currentStep === 5) return 80;
    if (currentStep === 6) return 100;
    return 0;
  };

  // Validation des étapes
  const canProceedToStep = (step: FormStep): boolean => {
    switch (step) {
      case 2:
        return reportMode !== null;
      case 3:
        return reportMode === 'voice' ? !!audioBlob : (reportMode === 'written' && formData.category !== '');
      case 4:
        return reportMode === 'voice' ? true : !!(formData.title && formData.description && formData.region && formData.date);
      case 5:
        return true;
      case 6:
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < 6 && canProceedToStep((currentStep + 1) as FormStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6) as FormStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => Math.max(prev - 1, 1) as FormStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const submitReport = async () => {
  try {
    setIsLoading(true);

    if (!localStorage.getItem('auth_token')) {
        await apiService.loginAnonymous(language);
    }

    // Déterminer l'autorité appropriée en utilisant la classification
    let assignedDepartment = 'police'; // Valeur par défaut
    
    if (reportMode === 'written') {
      const selectedCategory = categories.find(cat => cat.id === formData.category);
      const categoryName = selectedCategory?.name_fr || '';
      
      const classification = ReportClassifier.classifyReport(
        categoryName,
        formData.region || 'Dakar',
        formData.description
      );
      
      assignedDepartment = classification.department;
    } else {
      // Pour le mode vocal, utiliser une classification basique
      const classification = ReportClassifier.classifyReport(
        'Autres',
        formData.region || 'Dakar',
        'Signalement vocal'
      );
      assignedDepartment = classification.department;
    }

    // Pour le mode vocal, utiliser les données minimales avec valeurs par défaut
    let reportData: any = {
      location_text: formData.location || undefined,
      latitude: gpsLocation?.lat,
      longitude: gpsLocation?.lng,
        region: formData.region || 'Dakar', // Valeur par défaut si non rempli
        incident_date: formData.date || new Date().toISOString().split('T')[0], // Date du jour par défaut
      incident_time: formData.time || undefined,
      priority: 'medium',
        is_anonymous: isAnonymous || reportMode === 'anonymous',
        contact_allowed: reportMode === 'voice' ? false : formData.contactAllowed, // Par défaut false pour vocal
      language: language,
      // Ajouter le département assigné pour classification future
      assigned_department: assignedDepartment,
    };

      if (reportMode === 'written') {
      // Trouver la catégorie sélectionnée
      const selectedCategory = categories.find(cat => cat.id === formData.category);
      
      reportData = {
        ...reportData,
          category: Number(selectedCategory?.id) || 1, // Utiliser directement l'ID
        title: formData.title,
        description: formData.description,
          other_crime_specification: otherCrimeSpecification || undefined,
      };
      await apiService.createReport(reportData, formData.files);
    } else if (reportMode === 'voice' && audioBlob) {
        // Mode vocal : seulement l'audio, pas besoin d'autres champs
      const audioFile = new File([audioBlob], 'voice_report.wav', { type: 'audio/wav' });
      await apiService.createReport(reportData, [], audioFile);
      } else if (reportMode === 'anonymous' && audioBlob) {
        // Mode anonyme avec audio
        const audioFile = new File([audioBlob], 'voice_report.wav', { type: 'audio/wav' });
        await apiService.createReport(reportData, formData.files, audioFile);
      } else if (reportMode === 'anonymous') {
        // Mode anonyme sans audio (avec formulaire)
        reportData = {
          ...reportData,
          category: Number(formData.category) || 1, // Utiliser directement l'ID
          title: formData.title || 'Signalement anonyme',
          description: formData.description || 'Signalement anonyme',
          other_crime_specification: otherCrimeSpecification || undefined,
        };
        await apiService.createReport(reportData, formData.files);
      }

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onPageChange('my-reports');
    }, 3000);

  } catch (error) {
    console.error('Erreur lors de la soumission:', error);
    alert(language === 'fr' 
      ? "Erreur lors de l'envoi du signalement" 
      : "Njub ci yónnee signalement bi"
    );
  } finally {
    setIsLoading(false);
  }
};

  // Helper pour obtenir les traductions
  const getText = (_key: string, fr: string, wo: string) => language === 'fr' ? fr : wo;
  
  const t = {
    title: getText('title', "Nouveau Signalement", "Baxal bu Bees"),
    subtitle: getText('subtitle', "Signalez un crime ou un incident en toute sécurité", "Xamal krim mbaa insidan ci kumpa"),
    step1: getText('step1', "Mode de signalement", "Mode bu baxal bi"),
    step2: getText('step2', "Catégorie de crime", "Mbind njub"),
    step3: getText('step3', "Détails du signalement", "Xët ci baxal bi"),
    step4: getText('step4', "Pièces jointes", "Pis"),
    step5: getText('step5', "Autorisation de contact", "Jaayoo jokkoo"),
    step6: getText('step6', "Soumission", "Yónne"),
    written: getText('written', "Signalement Écrit", "Baxal ak Bind"),
    voice: getText('voice', "Signalement Vocal", "Baxal ak Baat"),
    anonymous: getText('anonymous', "Signalement Anonyme", "Baxal bu Sutura"),
    writtenDesc: getText('writtenDesc', "Remplissez un formulaire détaillé", "Feesal ab formulaire bu jëm"),
    voiceDesc: getText('voiceDesc', "Enregistrez votre signalement vocalement", "Enregistrer sa baxal ak baat"),
    anonymousDesc: getText('anonymousDesc', "Votre identité restera confidentielle", "Sa identité dina jëkk"),
    category: getText('category', "Catégorie de crime", "Mbind njub"),
    specify: getText('specify', "Précisez le type de crime", "Ñakk mbind njub bi"),
    titleLabel: getText('titleLabel', "Titre du signalement", "Ndongo baxal bi"),
    description: getText('description', "Description détaillée", "Xalaat bu jëm"),
    location: getText('location', "Localisation", "Bër"),
    region: getText('region', "Région", "Réegion"),
    date: getText('date', "Date de l'incident", "Beesu insidan bi"),
    time: getText('time', "Heure de l'incident", "Waxtu insidan bi"),
    attachments: getText('attachments', "Pièces jointes", "Pis"),
    noAttachments: getText('noAttachments', "Aucune pièce jointe ajoutée", "Pis dëggu"),
    addFiles: getText('addFiles', "Glissez vos fichiers ici ou cliquez pour choisir (max 5)", "Sottal fiyee ci bépp walla click ngir tànn (max 5)"),
    contactAllowed: getText('contactAllowed', "Autoriser les autorités à me contacter", "Jaayoo autorités yi jokkoo"),
    contactDesc: getText('contactDesc', "Les autorités peuvent vous contacter pour des informations complémentaires", "Autorités yi mën nañu la jokkoo ngir xibaar yu ëpp"),
    submit: getText('submit', "Soumettre le signalement", "Yónnee baxal bi"),
    loading: getText('loading', "Envoi en cours...", "Yónne daje..."),
    success: getText('success', "Merci ! Votre signalement a été envoyé.", "Jërejëf! Sa baxal bi yónnee na."),
    next: getText('next', "Suivant", "Ci topp"),
    previous: getText('previous', "Précédent", "Ci ginaw"),
    listen: getText('listen', "Écouter", "Dégg"),
    recording: getText('recording', "Enregistrement en cours...", "Enregistrement ci def..."),
  };

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
              ? 'Votre signalement a été transmis aux autorités compétentes. Vous serez redirigé...'
              : 'Sa baxal bi ñu ko yónnee autorités yu moom xam-xam. Dinaa la yónnee...'}
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
        {reportMode && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-slide-down">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-700">{language === 'fr' ? 'Progression' : 'Daje'}</span>
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
              {reportMode === 'voice' ? (
                // Pour le mode vocal : seulement étapes 1, 2, 6
                <>
                  {[1, 2, 6].map((step) => (
                    <div
                      key={step}
                      className={`flex flex-col items-center flex-1 ${
                        step <= currentStep || (step === 6 && currentStep === 6) ? 'opacity-100' : 'opacity-40'
                      } transition-opacity duration-300`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                          step < currentStep || (step === 2 && audioBlob && currentStep === 6)
                            ? 'bg-green-500'
                            : step === currentStep
                            ? 'bg-purple-600 ring-4 ring-purple-200'
                            : 'bg-gray-300'
                        } transition-all duration-300`}
                      >
                        {(step < currentStep || (step === 2 && audioBlob && currentStep === 6)) ? <CheckCircle className="w-6 h-6" /> : step}
                      </div>
                      <span className="text-xs mt-2 text-center font-medium text-gray-700 hidden md:block">
                        {step === 1 && t.step1}
                        {step === 2 && (language === 'fr' ? 'Enregistrement' : 'Enregistrement')}
                        {step === 6 && t.step6}
                      </span>
                    </div>
                  ))}
                </>
              ) : (
                // Pour les autres modes : toutes les étapes
                [1, 2, 3, 4, 5, 6].map((step) => (
                  <div
                    key={step}
                    className={`flex flex-col items-center flex-1 ${
                      step <= currentStep ? 'opacity-100' : 'opacity-40'
                    } transition-opacity duration-300`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                        step < currentStep
                          ? 'bg-green-500'
                          : step === currentStep
                          ? 'bg-blue-600 ring-4 ring-blue-200'
                          : 'bg-gray-300'
                      } transition-all duration-300`}
                    >
                      {step < currentStep ? <CheckCircle className="w-6 h-6" /> : step}
                    </div>
                    <span className="text-xs mt-2 text-center font-medium text-gray-700 hidden md:block">
                      {step === 1 && t.step1}
                      {step === 2 && t.step2}
                      {step === 3 && t.step3}
                      {step === 4 && t.step4}
                      {step === 5 && t.step5}
                      {step === 6 && t.step6}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Étape 1: Choix du mode */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                {t.step1}
                <button
                  type="button"
                  onClick={() => playAudio(t.step1)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  title={t.listen}
                >
                  <Volume2 className="w-6 h-6" />
                </button>
              </h2>
              <p className="text-gray-600">
            {language === 'fr' 
              ? 'Choisissez le mode de signalement qui vous convient le mieux'
                  : 'Tànn mode bu baxal bi gën nga ko jëfandikoo'}
          </p>
        </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Mode Écrit */}
            <button
                onClick={() => {
                  setReportMode('written');
                  setIsAnonymous(false);
                  setTimeout(() => nextStep(), 300);
                }}
                className="group relative p-8 rounded-2xl border-4 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-blue-600 p-6 rounded-full mb-4 group-hover:bg-blue-700 transition-colors">
                    <FileText className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    ✍️ {t.written}
              </h3>
              <p className="text-gray-600 text-sm">
                    {t.writtenDesc}
              </p>
                </div>
            </button>

              {/* Mode Vocal */}
            <button
                onClick={() => {
                  setReportMode('voice');
                  setIsAnonymous(false);
                  setTimeout(() => nextStep(), 300);
                }}
                className="group relative p-8 rounded-2xl border-4 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-purple-600 p-6 rounded-full mb-4 group-hover:bg-purple-700 transition-colors">
                    <Mic className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    🎤 {t.voice}
              </h3>
              <p className="text-gray-600 text-sm">
                    {t.voiceDesc}
              </p>
                </div>
            </button>

              {/* Mode Anonyme */}
              <button
                onClick={() => {
                  setReportMode('anonymous');
                  setIsAnonymous(true);
                  setCurrentStep(3); // Passer directement à l'étape 3
                }}
                className="group relative p-8 rounded-2xl border-4 border-green-200 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-green-600 p-6 rounded-full mb-4 group-hover:bg-green-700 transition-colors">
                    <User className="w-12 h-12 text-white" />
          </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    👤 {t.anonymous}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {t.anonymousDesc}
                  </p>
        </div>
              </button>
            </div>
          </div>
        )}

        {/* Étape 2: Catégorie de crime (uniquement pour mode écrit) */}
        {currentStep === 2 && reportMode === 'written' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-orange-500 animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                {t.step2}
                <button
                  type="button"
                  onClick={() => playAudio(t.step2)}
                  className="text-orange-600 hover:text-orange-800 transition-colors"
                  title={t.listen}
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </h2>
              <p className="text-gray-600">
                    {language === 'fr' 
                  ? 'Sélectionnez la catégorie de crime qui correspond à votre signalement'
                  : 'Tànn mbind njub bi moom sa baxal bi'}
                  </p>
            </div>

            {/* Affichage de l'autorité déterminée */}
            {selectedAuthority && (
              <div className="mb-6 p-4 rounded-xl border-2 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: selectedAuthority.color }}>
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {language === 'fr' ? selectedAuthority.name_fr : selectedAuthority.name_wo}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {language === 'fr' ? selectedAuthority.description_fr : selectedAuthority.description_wo}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => {
                const getIcon = () => {
                  if (category.authority_type === 'cdp') return <CreditCard className="w-8 h-8" />;
                  if (category.authority_type === 'dsc') return <Monitor className="w-8 h-8" />;
                  if (category.authority_type === 'police') return <Badge className="w-8 h-8" />;
                  if (category.authority_type === 'gendarmerie') return <Shield className="w-8 h-8" />;
                  return <HelpCircle className="w-8 h-8" />;
                };

                const authority = null; // TODO: Implement authority lookup

                return (
                  <button
              key={category.id}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, category: category.id }));
                      
                      // TODO: Update authority selection logic
                      
                      setTimeout(() => nextStep(), 300);
                    }}
                    className={`p-6 rounded-xl border-4 transition-all duration-300 transform hover:scale-105 ${
                formData.category === category.id
                        ? `border-${authority?.color.replace('#', '')} bg-${authority?.color.replace('#', '')}50 shadow-2xl ring-4 ring-${authority?.color.replace('#', '')}200`
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
                    }`}
                    style={{
                      borderColor: formData.category === category.id ? authority?.color : undefined,
                      backgroundColor: formData.category === category.id ? `${authority?.color}15` : undefined,
                    }}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div 
                        className="p-4 rounded-full mb-3"
                        style={{ 
                          backgroundColor: formData.category === category.id ? authority?.color : '#f3f4f6',
                          color: formData.category === category.id ? 'white' : '#6b7280'
                        }}
                      >
                        {getIcon()}
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">
                  {language === 'fr' ? category.name_fr : category.name_wo}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">
                        {authority?.name_fr}
                      </p>
                      {formData.category === category.id && (
                        <CheckCircle className="w-6 h-6 text-green-600 mt-2" />
                      )}
              </div>
                  </button>
                );
              })}
        </div>

            {/* Spécification pour "Autres" */}
              {(() => {
                const selectedCategory = categories.find(cat => Number(cat.id) === formData.category);
                return selectedCategory?.requires_specification && (
                <div className="mt-6 animate-fade-in">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.specify} *
                    </label>
                    <input
                      type="text"
                      required
                      value={otherCrimeSpecification}
                      onChange={(e) => setOtherCrimeSpecification(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-lg"
                      placeholder={language === 'fr' ? 'Décrivez le type de crime...' : 'Ñakk mbind njub bi...'}
                    />
                  </div>
                );
              })()}

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
              >
                <ChevronLeft className="w-5 h-5" /> {t.previous}
              </button>
              {formData.category > 0 && (() => {
                const selectedCategory = categories.find(cat => Number(cat.id) === formData.category);
                return (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={selectedCategory?.requires_specification && !otherCrimeSpecification}
                    className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
                  >
                    {t.next} <ChevronRight className="w-5 h-5" />
                  </button>
                );
              })()}
            </div>
          </div>
        )}

        {/* Étape 2: Enregistrement vocal (pour mode vocal) */}
        {currentStep === 2 && reportMode === 'voice' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-purple-500 animate-fade-in">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
                🎤 {t.voice}
                <button
                  type="button"
                  onClick={() => playAudio(t.voice)}
                  className="text-purple-600 hover:text-purple-800 transition-colors"
                  title={t.listen}
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </h2>
              <p className="text-gray-600 mb-2">
                {language === 'fr' 
                  ? 'Enregistrez votre signalement vocalement'
                  : 'Enregistrer sa baxal ak baat'}
              </p>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 inline-block mt-3">
                <p className="text-sm text-purple-800 font-medium">
                  {language === 'fr' 
                    ? '✨ Après l\'enregistrement, votre signalement sera directement envoyé. Aucun formulaire à remplir !'
                    : '✨ Gannaaw enregistrement bi, sa baxal bi dina yónnee ci bépp. Formulaire dëggu wuute!'}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-12 text-center">
              {!audioBlob ? (
            <div>
                  <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-32 h-32 rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-2xl ${
                      isRecording
                        ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    {isRecording ? (
                      <Square className="h-12 w-12 text-white" />
                    ) : (
                      <Mic className="h-12 w-12 text-white" />
                    )}
                  </button>
                  
                  <div className="mt-6">
                    {isRecording ? (
                      <div>
                        <p className="text-red-600 font-bold text-xl mb-2">
                          🔴 {t.recording}
                        </p>
                        <p className="text-2xl font-mono mt-2 text-gray-700">
                          {formatTime(recordingDuration)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-600 text-lg">
                        {language === 'fr' ? 'Cliquez pour commencer l\'enregistrement' : 'Click ngir tambali enregistrement'}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="animate-fade-in">
                  <div className="bg-green-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-16 w-16 text-green-600" />
                  </div>
                  
                  <p className="text-green-600 font-bold text-xl mb-6">
                    {language === 'fr' ? 'Enregistrement terminé!' : 'Enregistrement jeex!'}
                  </p>
                  
                  <div className="flex justify-center items-center space-x-6 mb-6">
                    <button
                      type="button"
                      onClick={() => playAudio()}
                      className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full transition-colors shadow-lg"
                    >
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </button>
                    
                    <span className="text-gray-700 font-mono text-xl">
                      {formatTime(recordingDuration)}
                    </span>
                    
                    <button
                      type="button"
                      onClick={resetRecording}
                      className="bg-gray-600 hover:bg-gray-700 text-white p-4 rounded-full transition-colors shadow-lg"
                    >
                      <RefreshCw className="h-6 w-6" />
                    </button>
                  </div>

                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
              >
                <ChevronLeft className="w-5 h-5" /> {t.previous}
              </button>
              {audioBlob && (
                <button
                  type="button"
                  onClick={() => {
                    // Pour le mode vocal, passer directement à l'étape de soumission
                    // Remplir automatiquement les données minimales nécessaires
                    if (!formData.region) {
                      setFormData(prev => ({ ...prev, region: 'Dakar' }));
                    }
                    if (!formData.date) {
                      setFormData(prev => ({ ...prev, date: new Date().toISOString().split('T')[0] }));
                    }
                    // Passer directement à l'étape 6 (soumission)
                    setCurrentStep(6);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-10 py-4 rounded-xl font-bold shadow-xl transition-all duration-200 flex items-center gap-3 transform hover:scale-105 text-lg"
                >
                  {language === 'fr' ? '✅ Terminer et envoyer' : '✅ Jeexal te yónnee'} 
                  <Send className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}


        {/* Étape 3: Détails du signalement (uniquement pour mode écrit et anonyme) */}
        {currentStep === 3 && reportMode !== null && reportMode !== 'voice' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-blue-500 animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                {t.step3}
                <button
                  type="button"
                  onClick={() => playAudio(t.step3)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  title={t.listen}
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </h2>
              <p className="text-gray-600">
                {language === 'fr' 
                  ? 'Remplissez les détails de votre signalement'
                  : 'Feesal xët ci sa baxal bi'}
              </p>
            </div>

            {reportMode === 'written' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    {t.titleLabel} *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg"
                placeholder={language === 'fr' ? 'Résumé en quelques mots...' : 'Résumé ci benn-benni baat...'}
              />
            </div>

            <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    {t.description} *
              </label>
              <textarea
                required
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg resize-none"
                placeholder={language === 'fr' ? 'Décrivez les faits en détail...' : 'Ñakk lu xëy ci jëm...'}
              />
            </div>
              </div>
            )}

            {reportMode === 'anonymous' && (
              <div className="bg-green-50 p-6 rounded-xl mb-6 border border-green-200">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-green-600 mt-1" />
              <div>
                    <p className="font-semibold text-gray-900 mb-2">
                      {language === 'fr' ? 'Signalement Anonyme' : 'Baxal bu Sutura'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {language === 'fr' 
                        ? 'Votre identité restera confidentielle. Vous pouvez remplir les champs optionnels ci-dessous pour plus de détails.'
                        : 'Sa identité dina jëkk. Mën nga feesal dëkk yi ci suuf ci ngir xët yu ëpp.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapIcon className="w-4 h-4 text-blue-600" />
                  {t.region} *
                </label>
                <select
                  required
                  value={formData.region}
                  onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg"
                >
                  {senegalRegions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  {t.location}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg"
                    placeholder={language === 'fr' ? 'Lieu précis...' : 'Bër bu baax...'}
                  />
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <MapPin className="h-5 w-5" />
                  </button>
                </div>
                {gpsLocation && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {language === 'fr' ? 'Position GPS obtenue' : 'Position GPS am'}
                  </p>
                )}
            </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  {t.date} *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  {t.time}
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg"
                />
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
                disabled={reportMode === 'written' && (!formData.title || !formData.description || !formData.region || !formData.date)}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
              >
                {t.next} <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Étape 4: Pièces jointes (uniquement pour mode écrit et anonyme) */}
        {currentStep === 4 && reportMode !== null && reportMode !== 'voice' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-green-500 animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
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
              <p className="text-gray-600">
                {language === 'fr' 
                  ? 'Ajoutez des documents si nécessaire (optionnel)'
                  : 'Yokk dokumentoog si soxla (dëggu)'}
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-green-500 transition-colors cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                <Paperclip className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-700 font-medium text-lg mb-2">
                  📁 {t.addFiles}
                </p>
                <p className="text-sm text-gray-500">
                  {language === 'fr' 
                    ? 'Images, vidéos, documents (max 5 fichiers, 10MB par fichier)'
                    : 'Nataal, vidéo, dokument (max 5 fiyee, 10MB ci fiyee'}
                  </p>
                </label>
              </div>
              
            {formData.files.length === 0 ? (
              <div className="mt-6 p-6 bg-gray-50 rounded-xl text-center">
                <Paperclip className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">📁 {t.noAttachments}</p>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                  {formData.files.map((file, index) => (
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
                        onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      >
                      <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
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
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
              >
                {t.next} <ChevronRight className="w-5 h-5" />
              </button>
                  </div>
                  </div>
        )}

        {/* Étape 5: Autorisation de contact (uniquement pour mode écrit et anonyme) */}
        {currentStep === 5 && reportMode !== null && reportMode !== 'voice' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-yellow-500 animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                {t.step5}
                <button
                  type="button"
                  onClick={() => playAudio(t.step5)}
                  className="text-yellow-600 hover:text-yellow-800 transition-colors"
                  title={t.listen}
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </h2>
              <p className="text-gray-600">
                {language === 'fr' 
                  ? 'Autorisez-vous les autorités à vous contacter ?'
                  : 'Jaayoo na autorités yi jokkoo la?'}
              </p>
            </div>

            {!isAnonymous && reportMode !== 'anonymous' && (
              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    id="contact"
                    checked={formData.contactAllowed}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactAllowed: e.target.checked }))}
                    className="w-6 h-6 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500 mt-1"
                  />
                <div>
                    <label htmlFor="contact" className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                      <Mail className="w-5 h-5 text-yellow-600" />
                      {t.contactAllowed}
                    </label>
                    <p className="text-sm text-gray-600 mt-2">
                      {t.contactDesc}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {(isAnonymous || reportMode === 'anonymous') && (
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="flex items-start space-x-4">
                  <Shield className="w-6 h-6 text-gray-600 mt-1" />
                      <div>
                    <p className="font-semibold text-gray-900">
                      {language === 'fr' ? 'Signalement Anonyme' : 'Baxal bu Sutura'}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {language === 'fr' 
                        ? 'Les autorités ne pourront pas vous contacter car votre signalement est anonyme.'
                        : 'Autorités yi du mëna la jokkoo ndaxte sa baxal bi sutura na.'}
                        </p>
                      </div>
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
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
                    >
                {t.next} <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

        {/* Étape 6: Soumission */}
        {currentStep === 6 && reportMode !== null && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-indigo-500 animate-fade-in">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
                {reportMode === 'voice' 
                  ? (language === 'fr' ? '🚀 Envoyer votre signalement vocal' : '🚀 Yónnee sa baxal ak baat')
                  : t.step6
                }
                <button
                  type="button"
                  onClick={() => playAudio(reportMode === 'voice' 
                    ? (language === 'fr' ? 'Envoyer votre signalement vocal' : 'Yónnee sa baxal ak baat')
                    : t.step6
                  )}
                  className="text-indigo-600 hover:text-indigo-800 transition-colors"
                  title={t.listen}
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </h2>
              <p className="text-gray-600">
                {reportMode === 'voice'
                  ? (language === 'fr' 
                      ? 'Votre signalement vocal est prêt à être envoyé. Cliquez sur le bouton ci-dessous pour finaliser.'
                      : 'Sa baxal ak baat bi pare na ngir yónne. Click ci bouton bi ci suuf ngir jeexal.')
                  : (language === 'fr' 
                      ? 'Vérifiez les informations et soumettez votre signalement'
                      : 'Seet xibaar yi te yónnee sa baxal bi')
                        }
                      </p>
                    </div>

            {/* Résumé */}
            <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {language === 'fr' ? 'Résumé de votre signalement' : 'Xët ci sa baxal bi'}
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>{language === 'fr' ? 'Mode:' : 'Mode:'}</strong> {
                  reportMode === 'written' ? t.written : 
                  reportMode === 'voice' ? t.voice : 
                  t.anonymous
                }</p>
                
                {reportMode === 'voice' && audioBlob && (
                  <>
                    <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-6 rounded-xl mb-4 border-2 border-purple-300 shadow-lg">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-purple-600 p-4 rounded-full shadow-md">
                          <Mic className="w-10 h-10 text-white" />
                  </div>
                        <div className="flex-1">
                          <p className="font-bold text-purple-900 text-xl mb-1">
                            {language === 'fr' ? '🎤 Signalement Vocal Enregistré' : '🎤 Baxal ak Baat Enregistré'}
                          </p>
                          <p className="text-sm text-purple-700 font-medium">
                            {language === 'fr' ? 'Durée:' : 'Waxtu:'} <strong className="text-lg">{formatTime(recordingDuration)}</strong>
                          </p>
                </div>
                        <div className="bg-green-100 p-2 rounded-full">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                      <div className="bg-white p-5 rounded-lg border-2 border-purple-200 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-100 p-2 rounded-full mt-1">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed flex-1">
                    {language === 'fr' 
                              ? 'Votre enregistrement vocal sera analysé automatiquement par nos services. Aucun formulaire supplémentaire n\'est nécessaire. Vous pouvez maintenant envoyer votre signalement en toute simplicité.'
                              : 'Sa enregistrement bi ñu ngi ko xool otomatikement ci nun services. Formulaire dëggu wuute. Mën nga yónnee sa baxal bi léegi ci kumpa bu mat sëkk.'}
                  </p>
                  </div>
                  </div>
                </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-700 mb-2">
                        <strong className="flex items-center gap-2">
                          <MapIcon className="w-4 h-4 text-blue-600" />
                          {language === 'fr' ? 'Région:' : 'Réegion:'}
                        </strong> 
                        <span className="ml-6">{formData.region || 'Dakar'}</span>
                        <span className="text-xs text-gray-500 ml-2">({language === 'fr' ? 'par défaut' : 'par défaut'})</span>
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          {language === 'fr' ? 'Date:' : 'Bees:'}
                        </strong>
                        <span className="ml-6">{formData.date || new Date().toLocaleDateString('fr-FR')}</span>
                        <span className="text-xs text-gray-500 ml-2">({language === 'fr' ? 'aujourd\'hui' : 'bés ci'})</span>
                      </p>
                    </div>
                  </>
                )}
                
                {reportMode !== 'voice' && (
                  <>
                    {reportMode === 'written' && formData.category > 0 && (
                      <p><strong>{t.category}:</strong> {
                        categories.find(c => Number(c.id) === formData.category) 
                          ? (language === 'fr' 
                              ? categories.find(c => Number(c.id) === formData.category)!.name_fr 
                              : categories.find(c => Number(c.id) === formData.category)!.name_wo)
                          : ''
                      }</p>
                    )}
                    {reportMode === 'written' && formData.title && (
                      <p><strong>{t.titleLabel}:</strong> {formData.title}</p>
                    )}
                    <p><strong>{t.region}:</strong> {formData.region}</p>
                    {formData.location && (
                      <p><strong>{t.location}:</strong> {formData.location}</p>
                    )}
                    <p><strong>{t.date}:</strong> {formData.date}</p>
                    <p><strong>{t.attachments}:</strong> {formData.files.length}</p>
                    {reportMode === 'anonymous' && audioBlob && (
                      <p><strong>{language === 'fr' ? 'Enregistrement vocal:' : 'Enregistrement ak baat:'}</strong> {formatTime(recordingDuration)}</p>
                    )}
                  </>
                )}
                  </div>
                </div>

            <div className="flex justify-between">
              {reportMode !== 'voice' && (
                  <button
                    type="button"
                  onClick={prevStep}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
                  >
                  <ChevronLeft className="w-5 h-5" /> {t.previous}
                  </button>
              )}
              {reportMode === 'voice' && (
                  <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
                >
                  <ChevronLeft className="w-5 h-5" /> {language === 'fr' ? 'Retour à l\'enregistrement' : 'Dellu ci enregistrement'}
                </button>
              )}
              <button
                type="button"
                    onClick={submitReport}
                disabled={isLoading || (reportMode === 'voice' && !audioBlob)}
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-12 py-4 rounded-xl font-bold shadow-xl transition-all duration-200 flex items-center gap-3 transform hover:scale-105 text-lg ml-auto"
                  >
                    {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {t.loading}
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6" />
                    🚀 {t.submit}
                  </>
                    )}
                  </button>
                </div>
              </div>
            )}
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

