# Milea Estate Wine Club Calculator Development Guide

This guide will walk you through creating a wine club calculator and sign-up application for Milea Estate Vineyard. The application will have two main components:

1. An interactive calculator that shows potential savings for different club tiers
2. A club sign-up form for joining the selected membership tier

## Project Setup

### Step 1: Initialize the React Project

```bash
# Navigate to the existing folder
cd C:\Users\russe\club-calculator

# Initialize a new React project
npx create-react-app .

# Install required dependencies
npm install react-router-dom axios tailwindcss postcss autoprefixer
```

### Step 2: Configure Tailwind CSS

```bash
# Initialize Tailwind CSS
npx tailwindcss init -p
```

Replace the content of `tailwind.config.js` with the provided configuration:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#715100",
        background: "#D8D1AE",
        darkBrown: "#5A3E00",
        darkBrownHover: "#3D2900",
      },
      fontFamily: {
        gilda: ["Gilda Display", "serif"],
      },
    },
  },
  plugins: [],
};
```

### Step 3: Create Environment Variables

Create a `.env` file in the root directory with your Commerce7 API credentials (which you already have):

```
# Commerce7 API Credentials
REACT_APP_C7_APP_ID=club-test
REACT_APP_C7_SECRET_KEY=NXL3UAMLoqkdYejnuJDp73JOizvancWeyZgY71fbPiaTeyotPBoKL5AuOFN4Kh2F
REACT_APP_C7_TENANT_ID=milea-estate-vineyard

# Club IDs
REACT_APP_CLUB_JUMPER_ID=2ba4f45e-51b9-45af-ab34-6162b9383948
REACT_APP_CLUB_GRAND_PRIX_ID=a708a00a-2bd6-4f5d-9ce6-e1e37b107808
REACT_APP_CLUB_TRIPLE_CROWN_ID=0a2dbd7e-656c-4cb9-a0c7-146187fccefe

# Pickup Location ID
REACT_APP_PICKUP_LOCATION_ID=e75bfc54-009d-43db-8ed7-113158cce63e
```

Note: We added `REACT_APP_` prefix to make the variables accessible in the React application.

### Step 4: Set Up Project Structure

Create the following folder structure:

```
src/
├── components/
│   ├── calculator/
│   │   ├── WelcomePage.jsx
│   │   ├── ConsumptionForm.jsx
│   │   ├── EventsForm.jsx
│   │   ├── TastingsForm.jsx
│   │   ├── ResultsPage.jsx
│   │   └── ProgressBar.jsx
│   ├── clubSignup/
│   │   ├── ClubSignupForm.jsx
│   │   ├── CustomerInfoStep.jsx
│   │   ├── BillingAddressStep.jsx
│   │   ├── ShippingAddressStep.jsx
│   │   ├── TermsAndSubmitStep.jsx
│   │   ├── FormStepper.jsx
│   │   └── FormSuccess.jsx
│   └── common/
│       ├── Button.jsx
│       ├── Modal.jsx
│       └── Header.jsx
├── hooks/
│   └── useCommerce7Api.js
├── contexts/
│   └── CalculatorContext.jsx
├── utils/
│   └── calculatorUtils.js
├── App.jsx
└── index.js
```

## Part 1: Calculator Implementation

### Step 5: Create Calculator Context

This context will manage the state across all calculator steps:

```jsx
// src/contexts/CalculatorContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const CalculatorContext = createContext();

export const CalculatorProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    bottlesPerMonth: 0,
    giftBottlesPerYear: 0,
    selectedEvents: {
      culinarySeries: false,
      pickupParties: false,
      roseDay: false,
      fizzFest: false,
      thanksgiving: false
    },
    useQuarterlyTastings: false,
    complimentaryTastings: 0
  });
  
  const [savings, setSavings] = useState({
    tripleCrown: 0,
    grandPrix: 0,
    jumper: 0
  });

  // Update form data
  const updateFormData = (data) => {
    setFormData(prevState => ({
      ...prevState,
      ...data
    }));
  };

  // Calculate savings whenever form data changes
  useEffect(() => {
    calculateSavings();
  }, [formData]);

  // Logic to calculate savings for each tier
  const calculateSavings = () => {
    let tripleCrownTotal = 0;
    let grandPrixTotal = 0;
    let jumperTotal = 0;

    // Wine discounts
    const annualBottles = (formData.bottlesPerMonth * 12) + formData.giftBottlesPerYear;
    tripleCrownTotal += 230; // Average wine savings for Triple Crown
    grandPrixTotal += 115; // Average wine savings for Grand Prix
    jumperTotal += 76; // Average wine savings for Jumper

    // Food discounts (Triple Crown only)
    tripleCrownTotal += 30;

    // Event discounts
    if (formData.selectedEvents.culinarySeries) {
      // $25 off each dinner, assuming at least two per year
      tripleCrownTotal += 50;
      grandPrixTotal += 50;
      jumperTotal += 50;
    }

    if (formData.selectedEvents.pickupParties) {
      // Two free tickets at $35 each for 4 parties
      const pickupPartySavings = 35 * 2 * 4;
      tripleCrownTotal += pickupPartySavings;
      grandPrixTotal += pickupPartySavings;
      jumperTotal += pickupPartySavings;
    }

    // Individual events (Rose Day, Fizz Fest, Thanksgiving)
    const eventSavings = (event) => {
      return formData.selectedEvents[event] ? 35 * 2 : 0; // Two tickets at $35 each
    };

    tripleCrownTotal += eventSavings('roseDay');
    tripleCrownTotal += eventSavings('fizzFest');
    tripleCrownTotal += eventSavings('thanksgiving');
    
    grandPrixTotal += eventSavings('roseDay');
    grandPrixTotal += eventSavings('fizzFest');
    grandPrixTotal += eventSavings('thanksgiving');
    
    jumperTotal += eventSavings('roseDay');
    jumperTotal += eventSavings('fizzFest');
    jumperTotal += eventSavings('thanksgiving');

    // Quarterly tastings (Triple Crown and Grand Prix only)
    if (formData.useQuarterlyTastings) {
      const tastingSavings = 100 * 4; // $100 per quarter
      tripleCrownTotal += tastingSavings;
      grandPrixTotal += tastingSavings;
    }

    // Complimentary tastings
    const complimentarySavings = formData.complimentaryTastings * 25;
    tripleCrownTotal += complimentarySavings;
    grandPrixTotal += complimentarySavings;
    jumperTotal += complimentarySavings;

    setSavings({
      tripleCrown: tripleCrownTotal,
      grandPrix: grandPrixTotal,
      jumper: jumperTotal
    });
  };

  // Navigation functions
  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);
  const goToStep = (step) => setCurrentStep(step);
  const resetCalculator = () => {
    setCurrentStep(0);
    setFormData({
      bottlesPerMonth: 0,
      giftBottlesPerYear: 0,
      selectedEvents: {
        culinarySeries: false,
        pickupParties: false,
        roseDay: false,
        fizzFest: false,
        thanksgiving: false
      },
      useQuarterlyTastings: false,
      complimentaryTastings: 0
    });
  };

  return (
    <CalculatorContext.Provider
      value={{
        currentStep,
        formData,
        savings,
        updateFormData,
        nextStep,
        prevStep,
        goToStep,
        resetCalculator
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
};

export const useCalculator = () => useContext(CalculatorContext);
```

### Step 6: Create the Calculator Components

#### Welcome Page

```jsx
// src/components/calculator/WelcomePage.jsx
import React from 'react';
import Button from '../common/Button';
import { useCalculator } from '../../contexts/CalculatorContext';

const WelcomePage = () => {
  const { nextStep } = useCalculator();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <img 
        src="https://i.imgur.com/qfTW5j0.png" 
        alt="Milea Estate Vineyard Logo" 
        className="w-64 mb-8"
      />
      <h1 className="text-3xl font-gilda text-primary text-center mb-4">
        Milea Estate Club Calculator
      </h1>
      <h2 className="text-xl text-darkBrown mb-8 text-center">
        Calculate your savings today
      </h2>
      <Button onClick={nextStep}>Start</Button>
    </div>
  );
};

export default WelcomePage;
```

#### Progress Bar Component

```jsx
// src/components/calculator/ProgressBar.jsx
import React from 'react';
import { useCalculator } from '../../contexts/CalculatorContext';

const ProgressBar = () => {
  const { currentStep } = useCalculator();
  
  // Define the total number of steps (0-indexed)
  const totalSteps = 3;
  
  // Calculate progress percentage
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="w-full mb-8">
      <div className="w-full h-2 bg-gray-200 rounded-full">
        <div 
          className="h-full bg-primary rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <div>Welcome</div>
        <div>Consumption</div>
        <div>Events</div>
        <div>Tastings</div>
        <div>Results</div>
      </div>
    </div>
  );
};

export default ProgressBar;
```

#### Consumption Form

```jsx
// src/components/calculator/ConsumptionForm.jsx
import React from 'react';
import Button from '../common/Button';
import { useCalculator } from '../../contexts/CalculatorContext';
import ProgressBar from './ProgressBar';

const ConsumptionForm = () => {
  const { formData, updateFormData, nextStep, prevStep } = useCalculator();

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: parseInt(value) || 0 });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <ProgressBar />
      
      <h2 className="text-2xl font-gilda text-primary mb-6">Your Wine Consumption</h2>
      
      <div className="mb-6">
        <label className="block text-darkBrown mb-2">
          How many bottles of wine do you drink per month?
        </label>
        <input
          type="number"
          name="bottlesPerMonth"
          value={formData.bottlesPerMonth}
          onChange={handleChange}
          min="0"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      
      <div className="mb-8">
        <label className="block text-darkBrown mb-2">
          Do you give wine as gifts? If so, how many bottles annually?
        </label>
        <input
          type="number"
          name="giftBottlesPerYear"
          value={formData.giftBottlesPerYear}
          onChange={handleChange}
          min="0"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      
      <div className="flex justify-between">
        <Button variant="secondary" onClick={prevStep}>Back</Button>
        <Button onClick={nextStep}>Next</Button>
      </div>
    </div>
  );
};

export default ConsumptionForm;
```

#### Events Form

```jsx
// src/components/calculator/EventsForm.jsx
import React from 'react';
import Button from '../common/Button';
import { useCalculator } from '../../contexts/CalculatorContext';
import ProgressBar from './ProgressBar';

const EventsForm = () => {
  const { formData, updateFormData, nextStep, prevStep } = useCalculator();

  const handleToggle = (event) => {
    updateFormData({
      selectedEvents: {
        ...formData.selectedEvents,
        [event]: !formData.selectedEvents[event]
      }
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <ProgressBar />
      
      <h2 className="text-2xl font-gilda text-primary mb-6">Event Preferences</h2>
      
      <p className="mb-4 text-darkBrown">Which of these events would you like to attend?</p>
      
      <div className="space-y-4 mb-8">
        <EventToggle
          label="The Milea Culinary Series"
          checked={formData.selectedEvents.culinarySeries}
          onChange={() => handleToggle('culinarySeries')}
        />
        
        <EventToggle
          label="Club Pickup Parties"
          checked={formData.selectedEvents.pickupParties}
          onChange={() => handleToggle('pickupParties')}
        />
        
        <EventToggle
          label="Rosé Day"
          checked={formData.selectedEvents.roseDay}
          onChange={() => handleToggle('roseDay')}
        />
        
        <EventToggle
          label="Fizz Fest"
          checked={formData.selectedEvents.fizzFest}
          onChange={() => handleToggle('fizzFest')}
        />
        
        <EventToggle
          label="Thanksgiving Uncorked"
          checked={formData.selectedEvents.thanksgiving}
          onChange={() => handleToggle('thanksgiving')}
        />
      </div>
      
      <div className="flex justify-between">
        <Button variant="secondary" onClick={prevStep}>Back</Button>
        <Button onClick={nextStep}>Next</Button>
      </div>
    </div>
  );
};

const EventToggle = ({ label, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-darkBrown">{label}</span>
      <button
        type="button"
        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
          checked ? 'bg-primary' : 'bg-gray-300'
        }`}
        onClick={onChange}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

export default EventsForm;
```

#### Tastings Form

```jsx
// src/components/calculator/TastingsForm.jsx
import React from 'react';
import Button from '../common/Button';
import { useCalculator } from '../../contexts/CalculatorContext';
import ProgressBar from './ProgressBar';

const TastingsForm = () => {
  const { formData, updateFormData, nextStep, prevStep } = useCalculator();

  const handleToggle = () => {
    updateFormData({
      useQuarterlyTastings: !formData.useQuarterlyTastings
    });
  };

  const handleChange = (e) => {
    updateFormData({
      complimentaryTastings: parseInt(e.target.value) || 0
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <ProgressBar />
      
      <h2 className="text-2xl font-gilda text-primary mb-6">Tasting Preferences</h2>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-darkBrown">Will you use your free quarterly tastings?</span>
          <button
            type="button"
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              formData.useQuarterlyTastings ? 'bg-primary' : 'bg-gray-300'
            }`}
            onClick={handleToggle}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                formData.useQuarterlyTastings ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <p className="text-sm text-gray-500">
          Free quarterly tastings are available for Triple Crown and Grand Prix members.
        </p>
      </div>
      
      <div className="mb-8">
        <label className="block text-darkBrown mb-2">
          How many complimentary tastings would you like to give away per year to friends and family?
        </label>
        <input
          type="number"
          value={formData.complimentaryTastings}
          onChange={handleChange}
          min="0"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      
      <div className="flex justify-between">
        <Button variant="secondary" onClick={prevStep}>Back</Button>
        <Button onClick={nextStep}>See Your Results</Button>
      </div>
    </div>
  );
};

export default TastingsForm;
```

#### Results Page

```jsx
// src/components/calculator/ResultsPage.jsx
import React, { useState } from 'react';
import Button from '../common/Button';
import { useCalculator } from '../../contexts/CalculatorContext';
import ClubSignupForm from '../clubSignup/ClubSignupForm';
import Modal from '../common/Modal';

const ResultsPage = () => {
  const { savings, resetCalculator } = useCalculator();
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);

  const handleSignup = (clubId) => {
    setSelectedClub(clubId);
    setShowSignupModal(true);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-gilda text-primary mb-6 text-center">Your Potential Annual Savings</h2>
      
      {/* Triple Crown */}
      <ClubTier 
        name="Triple Crown"
        savings={savings.tripleCrown}
        highlighted={true}
        benefits={[
          '12 bottles per shipment (4x/year)',
          '15% off all Milea wines',
          '15% off Milea accommodations',
          '15% off Milea Local & Seasonal plates',
          'Reciprocal membership with Hudson Valley Vineyards',
          'Fully customizable shipments',
          'Access to exclusive club-only events',
          'Free quarterly tastings for member + 3 guests'
        ]}
        onJoin={() => handleSignup(process.env.REACT_APP_CLUB_TRIPLE_CROWN_ID)}
      />
      
      {/* Grand Prix */}
      <ClubTier 
        name="Grand Prix"
        savings={savings.grandPrix}
        benefits={[
          '6 bottles per shipment (4x/year)',
          '15% off all Milea wines',
          'Fully customizable shipments',
          'Access to exclusive club-only events',
          'Free quarterly tastings for member + 3 guests'
        ]}
        onJoin={() => handleSignup(process.env.REACT_APP_CLUB_GRAND_PRIX_ID)}
      />
      
      {/* Jumper */}
      <ClubTier 
        name="Jumper"
        savings={savings.jumper}
        benefits={[
          '4 bottles per shipment (4x/year)',
          '10% off all Milea wines',
          'Curated selection',
          'Access to exclusive club-only events'
        ]}
        onJoin={() => handleSignup(process.env.REACT_APP_CLUB_JUMPER_ID)}
      />
      
      <div className="mt-8 text-center">
        <a 
          href="https://mileaestatevineyard.com/wine-club/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          Learn more about the clubs
        </a>
      </div>
      
      <div className="mt-6 text-center">
        <Button variant="secondary" onClick={resetCalculator}>
          Start Over
        </Button>
      </div>

      {/* Signup Modal */}
      <Modal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        title="Join Milea Wine Club"
      >
        <ClubSignupForm 
          clubId={selectedClub} 
          onSuccess={() => setShowSignupModal(false)}
        />
      </Modal>
    </div>
  );
};

const ClubTier = ({ name, savings, highlighted, benefits, onJoin }) => {
  return (
    <div className={`mb-6 p-6 rounded-lg ${
      highlighted 
        ? 'border-2 border-primary bg-background' 
        : 'border border-gray-200'
    }`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-xl font-gilda ${
          highlighted ? 'text-primary' : 'text-darkBrown'
        }`}>
          {name}
        </h3>
        <div className="text-right">
          <div className="text-sm text-gray-600">Annual Savings</div>
          <div className="text-2xl font-bold text-primary">${savings}</div>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="font-medium mb-2">Club Benefits:</h4>
        <ul className="list-disc pl-5 space-y-1">
          {benefits.map((benefit, index) => (
            <li key={index} className="text-sm">{benefit}</li>
          ))}
        </ul>
      </div>
      
      <Button 
        variant={highlighted ? "primary" : "secondary"}
        onClick={onJoin}
        fullWidth
      >
        Join {name}
      </Button>
    </div>
  );
};

export default ResultsPage;
```

### Step 7: Create Common Components

Create the Button, Modal, and Header components:

```jsx
// src/components/common/Button.jsx
import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  fullWidth = false,
  disabled = false
}) => {
  const baseClasses = 'py-2 px-6 rounded-md font-medium focus:outline-none transition-colors';
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-darkBrownHover',
    secondary: 'bg-white text-primary border border-primary hover:bg-gray-100'
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
```

```jsx
// src/components/common/Modal.jsx
import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  // Close modal when escape key is pressed
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-gilda text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
```

```jsx
// src/components/common/Header.jsx
import React from 'react';

const Header = () => {
  return (
    <header className="bg-white p-4 shadow-md">
      <div className="container mx-auto flex justify-center">
        <img 
          src="https://i.imgur.com/qfTW5j0.png" 
          alt="Milea Estate Vineyard Logo" 
          className="h-16"
        />
      </div>
    </header>
  );
};

export default Header;
```

### Step 8: Implement App.jsx

```jsx
// src/App.jsx
import React from 'react';
import { CalculatorProvider } from './contexts/CalculatorContext';
import WelcomePage from './components/calculator/WelcomePage';
import ConsumptionForm from './components/calculator/ConsumptionForm';
import EventsForm from './components/calculator/EventsForm';
import TastingsForm from './components/calculator/TastingsForm';
import ResultsPage from './components/calculator/ResultsPage';
import Header from './components/common/Header';

function App() {
  return (
    <CalculatorProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-8 px-4">
          <Calculator />
        </main>
      </div>
    </CalculatorProvider>
  );
}

// Calculator Component that shows the correct step
const Calculator = () => {
  const { currentStep, useCalculator } = useCalculator();

  // Render the appropriate step
  switch (currentStep) {
    case 0:
      return <WelcomePage />;
    case 1:
      return <ConsumptionForm />;
    case 2:
      return <EventsForm />;
    case 3:
      return <TastingsForm />;
    case 4:
      return <ResultsPage />;
    default:
      return <WelcomePage />;
  }
};

export default App;
```

