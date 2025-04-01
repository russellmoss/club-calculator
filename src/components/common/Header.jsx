import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-gilda">Milea Estate Wine Club</h1>
          <nav className="space-x-6">
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