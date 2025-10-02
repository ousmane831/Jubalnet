import React, { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { HomePage } from './components/Pages/HomePage';
import { ReportPage } from './components/Pages/ReportPage';
import { AuthPage } from './components/Pages/AuthPage';
import { EmergencyPage } from './components/Pages/EmergencyPage';
import { MyReportsPage } from './components/Pages/MyReportsPage';
import { PreventionPage } from './components/Pages/PreventionPage';
import { DashboardPage } from './components/Pages/DashboardPage';
import Confidentialite from './components/Pages/Confidentialite';
import { ComplaintForm } from './components/Pages/ComplaintForm';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
  switch (currentPage) {
    case 'home':
      return <HomePage onPageChange={setCurrentPage} />;
    case 'report':
      return <ReportPage onPageChange={setCurrentPage} />;
    case 'auth':
    case 'register':
      return <AuthPage onPageChange={setCurrentPage} />;
    case 'emergency':
      return <EmergencyPage onPageChange={setCurrentPage} />;
    case 'my-reports':
      return <MyReportsPage onPageChange={setCurrentPage} />;
    case 'prevention':
      return <PreventionPage onPageChange={setCurrentPage} />;
    case 'confidentialite':
      return <Confidentialite onPageChange={setCurrentPage} />;
    case 'dashboard':
        return <DashboardPage onPageChange={setCurrentPage} />;
    case 'plaint':
        return <ComplaintForm onPageChange={setCurrentPage} />;
    default:
      return <HomePage onPageChange={setCurrentPage} />;
  }
};


  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Header currentPage={currentPage} onPageChange={setCurrentPage} />
          <main className="flex-1">
            {renderPage()}
          </main>
         <Footer onPageChange={setCurrentPage} />
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;