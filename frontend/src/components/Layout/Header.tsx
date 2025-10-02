import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Shield, 
  Globe, 
  User,
  Home,
  FileText,
  Phone,
  Settings
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import logo from "../../assets/jubbalnet.jpg";

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, isAnonymous, logout } = useAuth();

  const navigationItems = [
    { id: 'home', label: t('nav.home'), icon: Home },
    { id: 'report', label: t('nav.report'), icon: FileText },
    ...(isAuthenticated ? [{ id: 'my-reports', label: t('nav.my_reports'), icon: FileText }] : []),
    { id: 'prevention', label: t('nav.prevention'), icon: Shield },
    { id: 'emergency', label: t('nav.emergency'), icon: Phone },
    ...(user && ["authority", "admin"].includes(user.role) ? [
    { id: 'dashboard', label: t('nav.dashboard'), icon: Settings }
    ] : []),

  ];

  return (
    <header className="bg-white shadow-lg border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
          <img 
            src={logo} 
            alt="logo_jubbalnet" 
            className="h-44 w-44 object-contain" // 👈 taille fixe, s’adapte bien
          />
        </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === item.id
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-2">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <Globe className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700 uppercase">
                  {language}
                </span>
              </button>
              
              {showLanguageMenu && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border z-50">
                  <button
                    onClick={() => {
                      setLanguage('fr');
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 rounded-t-lg ${
                      language === 'fr' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    🇫🇷 Français
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('wo');
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 rounded-b-lg ${
                      language === 'wo' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    🇸🇳 Wolof
                  </button>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <User className="h-4 w-4 text-gray-600" />
                <span className="hidden sm:inline text-sm font-medium text-gray-700">
                  {isAnonymous ? 'Anonyme' : user?.full_name || 'Utilisateur'}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b">
                        <p className="text-xs text-gray-500">Connecté en tant que</p>
                        <p className="text-sm font-medium text-gray-900">
                          {isAnonymous ? 'Utilisateur Anonyme' : user?.full_name}
                        </p>
                      </div>
                      {!isAnonymous && (
                        <button
                          onClick={() => {
                            onPageChange('profile');
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Profil & Paramètres
                        </button>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                      >
                        Se Déconnecter
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          onPageChange('auth');
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                      >
                        Se Connecter
                      </button>
                      <button
                        onClick={() => {
                          onPageChange('register');
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg"
                      >
                        S'Inscrire
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};