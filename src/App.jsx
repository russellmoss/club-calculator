import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import WelcomePage from './components/calculator/WelcomePage';
import CalculatorFlow from './components/calculator/CalculatorFlow';
import ClubSelectionPage from './components/clubSignup/ClubSelectionPage';
import Commerce7ApiTest from './components/clubSignup/Commerce7ApiTest';
import { ToastProvider } from './contexts/ToastContext';
import { CalculatorProvider } from './contexts/CalculatorContext';

function App() {
  return (
    <Router>
      <CalculatorProvider>
        <ToastProvider>
          <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/calculator" element={<CalculatorFlow />} />
                <Route path="/signup" element={<ClubSelectionPage />} />
                <Route path="/signup/form" element={<Navigate to="/signup" replace />} />
                <Route path="/test" element={<Commerce7ApiTest />} />
              </Routes>
            </main>
          </div>
        </ToastProvider>
      </CalculatorProvider>
    </Router>
  );
}

export default App; 