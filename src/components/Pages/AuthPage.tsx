import React, { useState } from 'react';
import { Eye, EyeOff, Shield, UserPlus, LogIn, Phone, Mail, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface AuthPageProps {
  onPageChange: (page: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onPageChange }) => {
  const { login, register, loginAnonymous } = useAuth();
  const { language, t } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register' | 'anonymous'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (mode === 'register') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error(language === 'fr' ? 'Les mots de passe ne correspondent pas' : 'Mot de passe yi du nann');
        }
        await register(formData.email, formData.password, formData.fullName, formData.phone);
      } else if (mode === 'login') {
        await login(formData.email, formData.password);
      }
      
      onPageChange('home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymousLogin = () => {
    loginAnonymous();
    onPageChange('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-2xl shadow-lg inline-block mb-4">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {mode === 'register' 
              ? (language === 'fr' ? 'Créer un Compte' : 'Sos ab Compte') 
              : (language === 'fr' ? 'Se Connecter' : 'Togg')
            }
          </h1>
          <p className="text-gray-600">
            {language === 'fr' 
              ? 'Accédez à la plateforme de dénonciation sécurisée'
              : 'Dugg ci platform bu baxal bu sécurisé'
            }
          </p>
        </div>

        {/* Mode Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                mode === 'login'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <LogIn className="h-4 w-4" />
                <span>{language === 'fr' ? 'Connexion' : 'Togg'}</span>
              </div>
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                mode === 'register'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <UserPlus className="h-4 w-4" />
                <span>{language === 'fr' ? 'Inscription' : 'Bindd'}</span>
              </div>
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'fr' ? 'Nom complet' : 'Tur bu moom'} *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={language === 'fr' ? 'Prénom et nom' : 'Tur ba ne'}
                    />
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'fr' ? 'Téléphone (optionnel)' : 'Téléphone (optionnel)'}
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+221 XX XXX XX XX"
                    />
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'fr' ? 'Adresse email' : 'Email'} *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={language === 'fr' ? 'votre@email.com' : 'sa@email.com'}
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'fr' ? 'Mot de passe' : 'Mot de passe'} *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={language === 'fr' ? 'Votre mot de passe' : 'Sa mot de passe'}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'fr' ? 'Confirmer le mot de passe' : 'Confimer mot de passe'} *
                </label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={language === 'fr' ? 'Confirmez votre mot de passe' : 'Confirmer sa mot de passe'}
                  minLength={6}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{language === 'fr' ? 'Chargement...' : 'Daje...'}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  {mode === 'register' ? <UserPlus className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
                  <span>
                    {mode === 'register' 
                      ? (language === 'fr' ? 'Créer mon compte' : 'Sos sama compte')
                      : (language === 'fr' ? 'Se connecter' : 'Togg')
                    }
                  </span>
                </div>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleAnonymousLogin}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
            >
              <div className="flex items-center justify-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>
                  {language === 'fr' ? 'Continuer en mode anonyme' : 'Continuer ci mode anonyme'}
                </span>
              </div>
            </button>
            <p className="text-center text-xs text-gray-500 mt-2">
              {language === 'fr' 
                ? 'Aucune information personnelle ne sera enregistrée'
                : 'Xibaar bu kenn du dëkk'
              }
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {mode === 'register' ? (
                <>
                  {language === 'fr' ? 'Déjà un compte ? ' : 'Am nga compte ? '}
                  <button
                    onClick={() => setMode('login')}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {language === 'fr' ? 'Se connecter' : 'Togg'}
                  </button>
                </>
              ) : (
                <>
                  {language === 'fr' ? 'Pas encore de compte ? ' : 'Amul compte ? '}
                  <button
                    onClick={() => setMode('register')}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {language === 'fr' ? 'S\'inscrire' : 'Bindd'}
                  </button>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => onPageChange('home')}
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            ← {language === 'fr' ? 'Retour à l\'accueil' : 'Dellu ci accueil'}
          </button>
        </div>
      </div>
    </div>
  );
};