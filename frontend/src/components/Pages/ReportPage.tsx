import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Mic, 
  Upload, 
  MapPin, 
  Shield,
  Paperclip,
  Play,
  Pause,
  Square,
  RefreshCw,
  Send,
  CheckCircle
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import { CrimeCategory } from '../../types';

interface ReportPageProps {
  onPageChange: (page: string) => void;
}

export const ReportPage: React.FC<ReportPageProps> = ({ onPageChange }) => {
  const { t, language } = useLanguage();
  const { isAuthenticated, loginAnonymous } = useAuth();
  
  const [reportMode, setReportMode] = useState<'form' | 'voice'>('form');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [setUseGps] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<{lat: number; lng: number} | null>(null);
  const [otherCrimeSpecification, setOtherCrimeSpecification] = useState('');
  const [categories, setCategories] = useState<CrimeCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [formData, setFormData] = useState({
    category: 0,  // ou null
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
        setUseGps(true);
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

  const playAudio = () => {
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
      files: [...prev.files, ...files].slice(0, 5) // Max 5 files
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    if (!isAuthenticated && !isAnonymous) {
      // Show auth options
      if (window.confirm(language === 'fr' ? 'Voulez-vous vous connecter ou continuer anonymement?' : 'Bëgg nga togg walla continuer ci anonyme?')) {
        setIsLoading(false);
        onPageChange('auth');
        return;
      } else {
        loginAnonymous();
        setIsAnonymous(true);
      }
    }

    // Submit report
    submitReport();
  };

  const submitReport = async () => {
  try {
    setIsLoading(true);

    // 1️⃣ Si pas de token, créer une session anonyme
    if (!localStorage.getItem('auth_token')) {
      await apiService.loginAnonymous(language); // mettra le token dans ApiService
    }

    // 2️⃣ Préparer les données de base du signalement
    let reportData: any = {
      other_crime_specification: otherCrimeSpecification || undefined,
      location_text: formData.location || undefined,
      latitude: gpsLocation?.lat,
      longitude: gpsLocation?.lng,
      region: formData.region,
      incident_date: formData.date,
      incident_time: formData.time || undefined,
      priority: 'medium',
      is_anonymous: isAnonymous,
      contact_allowed: formData.contactAllowed,
      language: language,
    };

    // 3️⃣ Ajouter les champs spécifiques au mode formulaire
    if (reportMode === 'form') {
      reportData = {
        ...reportData,
        category: formData.category, // obligatoire pour formulaire
        title: formData.title,
        description: formData.description,
      };
    }

    // 4️⃣ Soumettre le signalement selon le mode
    if (reportMode === 'form') {
      await apiService.createReport(reportData, formData.files);
    } else if (reportMode === 'voice' && audioBlob) {
      const audioFile = new File([audioBlob], 'voice_report.wav', { type: 'audio/wav' });
      await apiService.createReport(reportData, [], audioFile);
    } else {
      throw new Error('Aucun fichier audio disponible pour le signalement vocal.');
    }

    // 5️⃣ Succès
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



  if (showSuccess) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="mb-6">
            <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {language === 'fr' ? 'Signalement Envoyé!' : 'Baxal bi Yónnee!'}
            </h3>
            <p className="text-gray-600">
              {language === 'fr' 
                ? 'Votre signalement a été transmis aux autorités compétentes. Vous recevrez une notification dès qu\'il sera traité.'
                : 'Sa baxal bi ñu ko yónnee autorités yu moom xam-xam. Dinga am ab notification bu gis ni ñu ko wax.'
              }
            </p>
          </div>
          <p className="text-sm text-gray-500">
            {language === 'fr' ? 'Redirection automatique...' : 'Redirection otomatik...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('report.title')}
          </h1>
          <p className="text-lg text-gray-600">
            {language === 'fr' 
              ? 'Choisissez le mode de signalement qui vous convient le mieux'
              : 'Tànn mode bu baxal bi gën nga ko jëfandikoo'
            }
          </p>
        </div>

        {/* Mode Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setReportMode('form')}
              className={`p-6 rounded-xl border-2 transition-all ${
                reportMode === 'form'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <FileText className={`h-8 w-8 mb-3 ${reportMode === 'form' ? 'text-blue-600' : 'text-gray-400'}`} />
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                {t('report.form_mode')}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'fr' 
                  ? 'Remplissez un formulaire détaillé avec vos informations'
                  : 'Feesal ab formulaire bu jëm ak sa xibaar yi'
                }
              </p>
            </button>

            <button
              onClick={() => setReportMode('voice')}
              className={`p-6 rounded-xl border-2 transition-all ${
                reportMode === 'voice'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Mic className={`h-8 w-8 mb-3 ${reportMode === 'voice' ? 'text-blue-600' : 'text-gray-400'}`} />
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                {t('report.voice_mode')}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'fr' 
                  ? 'Enregistrez votre signalement directement par vocal'
                  : 'Enregistrer sa baxal ci vocal'
                }
              </p>
            </button>
          </div>
        </div>

        {/* Form Mode */}
        {reportMode === 'form' && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            {/* Anonymous Option */}
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <label htmlFor="anonymous" className="font-medium text-gray-900 flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-blue-600" />
                    {t('report.anonymous')}
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    {language === 'fr' 
                      ? 'Votre identité ne sera pas révélée aux autorités'
                      : 'Sa tur du nee autorités yi'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('report.category')} *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categories.map((category) => (
            <label
              key={category.id}
              className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                formData.category === Number(category.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="category"
                value={category.id}
                checked={formData.category === Number(category.id)}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, category: Number(e.target.value) }))
                }
                className="sr-only"
              />
              <div 
                className="w-4 h-4 rounded-full mr-3 flex-shrink-0"
                style={{ backgroundColor: category.color }}
              ></div>
              <div>
                <p className="font-medium text-gray-900">
                  {language === 'fr' ? category.name_fr : category.name_wo}
                </p>
                <p className="text-xs text-gray-500">
                  {language === 'fr' ? category.description_fr : category.description_wo}
                </p>
              </div>
            </label>
          ))}
        </div>

             {/* Other Crime Specification */}
              {(() => {
                const selectedCategory = categories.find(cat => Number(cat.id) === formData.category);
                return selectedCategory?.requires_specification && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'fr' ? 'Précisez le type de crime' : 'Ñakk mbind njub bi'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={otherCrimeSpecification}
                      onChange={(e) => setOtherCrimeSpecification(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={language === 'fr' ? 'Décrivez le type de crime...' : 'Ñakk mbind njub bi...'}
                    />
                  </div>
                );
              })()}

            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'fr' ? 'Titre du signalement' : 'Ndongo baxal bi'} *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={language === 'fr' ? 'Résumé en quelques mots...' : 'Résumé ci benn-benni baat...'}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('report.description')} *
              </label>
              <textarea
                required
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={language === 'fr' ? 'Décrivez les faits en détail...' : 'Ñakk lu xëy ci jëm...'}
              />
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'fr' ? 'Région' : 'Réegion'} *
                </label>
                <select
                  required
                  value={formData.region}
                  onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {senegalRegions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('report.location')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={language === 'fr' ? 'Lieu précis...' : 'Bër bu baax...'}
                  />
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-blue-600"
                  >
                    <MapPin className="h-5 w-5" />
                  </button>
                </div>
                {gpsLocation && (
                  <p className="text-xs text-green-600 mt-1">
                    📍 {language === 'fr' ? 'Position GPS obtenue' : 'Position GPS am'}
                  </p>
                )}
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('report.date')} *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('report.time')}
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'fr' ? 'Pièces jointes (optionnel)' : 'Dossiers yu jokk (optionnel)'}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {language === 'fr' ? 'Cliquez pour ajouter des fichiers' : 'Click ngir yokk dossiers'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {language === 'fr' ? 'Images, vidéos, documents (max 5)' : 'Nataal, vidéo, documents (max 5)'}
                  </p>
                </label>
              </div>
              
              {formData.files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Paperclip className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(1)}MB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Permission */}
            {!isAnonymous && (
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="contact"
                    checked={formData.contactAllowed}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactAllowed: e.target.checked }))}
                    className="mt-1"
                  />
                  <div>
                    <label htmlFor="contact" className="font-medium text-gray-900">
                      {language === 'fr' ? 'Autoriser le contact' : 'Jaayoo jokkoo'}
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      {language === 'fr' 
                        ? 'Les autorités peuvent vous contacter pour des informations complémentaires'
                        : 'Autorités yi mën nañu la jokkoo ngir xibaar yu ëpp'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => onPageChange('home')}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {language === 'fr' ? 'Annuler' : 'Nees'}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{language === 'fr' ? 'Envoi...' : 'Yónnee...'}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Send className="h-5 w-5" />
                    <span>{t('report.submit')}</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Voice Mode */}
        {reportMode === 'voice' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {language === 'fr' ? 'Signalement Vocal' : 'Baxal ak Baat'}
              </h3>
              <p className="text-gray-600">
                {language === 'fr' 
                  ? 'Appuyez sur le bouton pour commencer l\'enregistrement'
                  : 'Cuddal bouton bi ngir tambali enregistrement'
                }
              </p>
            </div>

            {/* Recording Interface */}
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              {!audioBlob ? (
                <div>
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${
                      isRecording
                        ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isRecording ? (
                      <Square className="h-8 w-8 text-white" />
                    ) : (
                      <Mic className="h-8 w-8 text-white" />
                    )}
                  </button>
                  
                  <div className="mt-4">
                    {isRecording ? (
                      <div>
                        <p className="text-red-600 font-semibold">
                          🔴 {language === 'fr' ? 'Enregistrement en cours...' : 'Enregistrement ci def...'}
                        </p>
                        <p className="text-lg font-mono mt-2 text-gray-700">
                          {formatTime(recordingDuration)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-600">
                        {language === 'fr' ? 'Cliquez pour commencer' : 'Click ngir tambali'}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  
                  <p className="text-green-600 font-semibold mb-4">
                    {language === 'fr' ? 'Enregistrement terminé!' : 'Enregistrement jeex!'}
                  </p>
                  
                  <div className="flex justify-center items-center space-x-4 mb-6">
                    <button
                      onClick={playAudio}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors"
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </button>
                    
                    <span className="text-gray-600 font-mono">
                      {formatTime(recordingDuration)}
                    </span>
                    
                    <button
                      onClick={resetRecording}
                      className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full transition-colors"
                    >
                      <RefreshCw className="h-5 w-5" />
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

            {/* Basic Info for Voice Report */}
            {audioBlob && (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="voice-anonymous"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="mt-1"
                    />
                    <div>
                      <label htmlFor="voice-anonymous" className="font-medium text-gray-900 flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-blue-600" />
                        {t('report.anonymous')}
                      </label>
                      <p className="text-sm text-gray-600 mt-1">
                        {language === 'fr' 
                          ? 'Votre voix sera automatiquement modifiée et votre identité protégée'
                          : 'Sa baat bi dina soppi otomatikement te sa identité dina jëkk'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Mic className="h-5 w-5 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">
                      {language === 'fr' ? 'Signalement Vocal Prêt' : 'Baxal ak Baat Pare'}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {language === 'fr' 
                      ? 'Votre enregistrement audio sera analysé automatiquement par nos services pour déterminer la catégorie et les détails du signalement.'
                      : 'Sa enregistrement bi ñu ngi ko xool otomatikement ngir gis catégorie ak détail yu signalement bi.'
                    }
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>{language === 'fr' ? 'Transcription automatique' : 'Transcription otomatik'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>{language === 'fr' ? 'Classification intelligente' : 'Classification intelligent'}</span>
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => onPageChange('home')}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {language === 'fr' ? 'Annuler' : 'Nees'}
                  </button>
                  <button
                    onClick={submitReport}
                    disabled={isLoading || !audioBlob}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>{language === 'fr' ? 'Envoi...' : 'Yónnee...'}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Send className="h-5 w-5" />
                        <span>{language === 'fr' ? 'Envoyer le Signalement Vocal' : 'Yónnee Baxal ak Baat'}</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};