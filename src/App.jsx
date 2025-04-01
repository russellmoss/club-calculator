import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CalculatorProvider } from './contexts/CalculatorContext';
import Header from './components/common/Header';
import WelcomePage from './components/calculator/WelcomePage';
import CalculatorFlow from './components/calculator/CalculatorFlow';
import ClubSelectionPage from './components/clubSignup/ClubSelectionPage';
import ClubSignupForm from './components/clubSignup/ClubSignupForm';
import Commerce7ApiTest from './components/clubSignup/Commerce7ApiTest';

function App() {
  return (
    <CalculatorProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto py-8 px-4">
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/calculator" element={<CalculatorFlow />} />
              <Route path="/signup" element={<ClubSelectionPage />} />
              <Route path="/signup/form" element={<Navigate to="/signup" replace />} />
              <Route path="/api-test" element={<Commerce7ApiTest />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CalculatorProvider>
  );
}

export default App; 