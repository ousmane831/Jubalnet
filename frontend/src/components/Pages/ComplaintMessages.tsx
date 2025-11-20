import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Send, 
  X, 
  Volume2, 
  VolumeX, 
  User, 
  Clock, 
  Bell, 
  Shield,
  Mic,
  MicOff,
  XCircle,
  CheckCircle2
} from 'lucide-react';
import { apiService } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';

interface ComplaintMessage {
  id: string;
  complaint: string;
  sender: {
    id: string;
    username: string;
    email: string;
  };
  sender_name: string;
  is_admin: boolean;
  is_current_user: boolean;
  message: string;
  created_at: string;
  read: boolean;
}

interface ComplaintMessagesProps {
  complaintId: string;
  complaintTitle?: string;
  onClose?: () => void;
  isOpen: boolean;
}

export const ComplaintMessages: React.FC<ComplaintMessagesProps> = ({
  complaintId,
  complaintTitle,
  onClose,
  isOpen
}) => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [messages, setMessages] = useState<ComplaintMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<{message: string; details?: any} | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Charger les messages
  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getComplaintMessages(complaintId);
      setMessages(data);
      
      // Vérifier s'il y a de nouveaux messages non lus
      const unreadCount = data.filter((msg: ComplaintMessage) => 
        !msg.read && !msg.is_current_user
      ).length;
      setHasNewMessage(unreadCount > 0);

      // Marquer les messages comme lus
      if (unreadCount > 0) {
        await apiService.markComplaintMessagesRead(complaintId);
      }
    } catch (error) {
      setError('Erreur lors du chargement des messages');
      console.error('Erreur lors du chargement des messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Polling pour vérifier les nouveaux messages
  useEffect(() => {
    if (isOpen && complaintId) {
      loadMessages();
      const interval = setInterval(loadMessages, 5000); // Vérifier toutes les 5 secondes
      return () => clearInterval(interval);
    }
  }, [isOpen, complaintId]);

  // Scroll automatique vers le bas
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Notification sonore et TTS pour nouveaux messages
  useEffect(() => {
    if (messages.length > 0 && hasNewMessage) {
      // Son de notification
      playNotificationSound();
      
      // Lecture vocale si activée
      if (ttsEnabled) {
        const lastMessage = messages[messages.length - 1];
        if (!lastMessage.is_current_user) {
          speakMessage(lastMessage.message);
        }
      }
    }
  }, [messages, hasNewMessage, ttsEnabled]);

  const playNotificationSound = () => {
    try {
      // Créer un son de notification simple avec Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      setError('Erreur lors de la lecture du son');
      console.error('Erreur lors de la lecture du son:', error);
    }
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'fr' ? 'fr-FR' : 'wo-SN';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    // Réinitialiser les erreurs précédentes
    setError(null);
    setApiError(null);
    
    try {
      setIsSending(true);
      const sentMessage = await apiService.sendComplaintMessage(complaintId, newMessage.trim());
      setMessages([...messages, sentMessage]);
      setNewMessage('');
      
      // Scroll vers le bas après envoi
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi du message:', error);
      
      // Gestion des erreurs plus détaillée
      let errorMessage = language === 'fr' 
        ? 'Erreur lors de l\'envoi du message' 
        : 'Jëf ju jëf ci yónnee baxal bi';
      
      if (error.status === 401) {
        errorMessage = language === 'fr'
          ? 'Session expirée. Veuillez vous reconnecter.'
          : 'Sesioon bi jóge na. Tànnatul waa ngi la ko.';
      } else if (error.status === 403) {
        errorMessage = language === 'fr'
          ? 'Vous n\'êtes pas autorisé à envoyer des messages pour cette plainte.'
          : 'Déetul mënul a ko joxe xibaar ci jëf ju jëf bii.';
      } else if (error.details) {
        // Afficher les détails de l'erreur si disponibles
        errorMessage = typeof error.details === 'string' 
          ? error.details 
          : JSON.stringify(error.details);
      }
      
      setApiError({
        message: errorMessage,
        details: error.details
      });
      
      // Faire défiler vers le haut pour afficher l'erreur
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSending(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) {
      return language === 'fr' ? 'À l\'instant' : 'Ci saa';
    } else if (minutes < 60) {
      return `${minutes} ${language === 'fr' ? 'min' : 'min'}`;
    } else if (hours < 24) {
      return `${hours} ${language === 'fr' ? 'h' : 'h'}`;
    } else if (days < 7) {
      return `${days} ${language === 'fr' ? 'j' : 'j'}`;
    } else {
      return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'wo-SN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 rounded-t-2xl text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-bold">
                {language === 'fr' ? 'Messages' : 'Bataaxal'}
              </h2>
              {complaintTitle && (
                <p className="text-sm text-blue-100">{complaintTitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Toggle TTS */}
            <button
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                ttsEnabled 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
              title={language === 'fr' ? 'Lecture vocale' : 'Jàngal ci baat'}
            >
              {ttsEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Affichage des erreurs d'API */}
        {apiError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-6 mt-4 rounded-r">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  {apiError.message}
                </p>
                {apiError.details && (
                  <details className="mt-2">
                    <summary className="text-sm text-red-700 cursor-pointer">
                      {language === 'fr' ? 'Détails techniques' : 'Xam-xam bu gëstu'}
                    </summary>
                    <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto max-h-40">
                      {typeof apiError.details === 'string' 
                        ? apiError.details 
                        : JSON.stringify(apiError.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Messages Container */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4"
        >
          {isLoading && messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">
                  {language === 'fr' ? 'Chargement des messages...' : 'Daje bataaxal yi...'}
                </p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  {language === 'fr' ? 'Aucun message pour le moment' : 'Amul bataaxal ci saa'}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {language === 'fr' ? 'Commencez la conversation' : 'Tàmbali jëfandikoo'}
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.is_current_user ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl p-4 shadow-md ${
                    message.is_current_user
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white'
                      : message.is_admin
                      ? 'bg-white border-2 border-indigo-200'
                      : 'bg-white border-2 border-gray-200'
                  }`}
                >
                  {/* Message Header */}
                  <div className="flex items-center gap-2 mb-2">
                    {message.is_admin ? (
                      <Shield className={`h-4 w-4 ${message.is_current_user ? 'text-white' : 'text-indigo-600'}`} />
                    ) : (
                      <User className={`h-4 w-4 ${message.is_current_user ? 'text-white' : 'text-gray-600'}`} />
                    )}
                    <span className={`text-sm font-semibold ${
                      message.is_current_user ? 'text-white' : 'text-gray-900'
                    }`}>
                      {message.is_current_user 
                        ? (language === 'fr' ? 'Vous' : 'Yow')
                        : message.sender_name
                      }
                    </span>
                    {!message.read && !message.is_current_user && (
                      <Bell className="h-3 w-3 text-orange-500 animate-pulse" />
                    )}
                  </div>

                  {/* Message Content */}
                  <p className={`text-sm leading-relaxed ${
                    message.is_current_user ? 'text-white' : 'text-gray-800'
                  }`}>
                    {message.message}
                  </p>

                  {/* Message Footer */}
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs flex items-center gap-1 ${
                      message.is_current_user ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      <Clock className="h-3 w-3" />
                      {formatDate(message.created_at)}
                    </span>
                    {message.read && message.is_current_user && (
                      <CheckCircle2 className="h-3 w-3 text-blue-200" />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
          <div className="flex gap-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={language === 'fr' ? 'Tapez votre message...' : 'Bind sa bataaxal bi...'}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              rows={2}
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{language === 'fr' ? 'Envoi...' : 'Yónnee...'}</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>{language === 'fr' ? 'Envoyer' : 'Yónnee'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

