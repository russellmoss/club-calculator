import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CalculatorProvider } from './contexts/CalculatorContext';
import Header from './components/common/Header';
import WelcomePage from './components/calculator/WelcomePage';
import CalculatorFlow from './components/calculator/CalculatorFlow';
import ClubSignupForm from './components/clubSignup/ClubSignupForm';

function App() {
  return (
    <CalculatorProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/calculator" element={<CalculatorFlow />} />
              <Route path="/signup" element={<ClubSignupForm />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CalculatorProvider>
  );
}

export default App;
