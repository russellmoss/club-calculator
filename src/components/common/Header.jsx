import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <h1 className="text-2xl font-gilda text-center sm:text-left">Milea Wine Club</h1>
          <nav className="flex justify-center sm:justify-end space-x-6">
            <Link to="/" className="hover:text-background transition-colors">Home</Link>
            <Link to="/calculator" className="hover:text-background transition-colors">Calculator</Link>
            <Link to="/signup" className="hover:text-background transition-colors">Sign Up</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 