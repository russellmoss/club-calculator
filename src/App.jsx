import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CalculatorProvider } from './contexts/CalculatorContext';
import Header from './components/common/Header';
import WelcomePage from './components/calculator/WelcomePage';
import ResultsPage from './components/calculator/ResultsPage';
import ClubSelectionPage from './components/clubSignup/ClubSelectionPage';
import Commerce7ApiTest from './components/clubSignup/Commerce7ApiTest';
import { ToastProvider } from './contexts/ToastContext';

function App() {
  return (
    <ToastProvider>
      <CalculatorProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto py-8 px-4">
              <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/calculator" element={<ResultsPage />} />
                <Route path="/signup" element={<ClubSelectionPage />} />
                <Route path="/signup/form" element={<Navigate to="/signup" replace />} />
                <Route path="/api-test" element={<Commerce7ApiTest />} />
              </Routes>
            </main>
          </div>
        </Router>
      </CalculatorProvider>
    </ToastProvider>
  );
}

export default App; 