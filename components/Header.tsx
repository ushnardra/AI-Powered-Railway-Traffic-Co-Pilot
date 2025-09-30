
import React from 'react';
import { View } from '../types';
import { TrainIcon } from './icons';

interface HeaderProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, setActiveView }) => {
  const navItems = [View.Dashboard, View.KPIs, View.Scenarios];

  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <TrainIcon className="h-8 w-8 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">
              Railway Traffic Co-Pilot
            </h1>
          </div>
          <nav className="flex space-x-1">
            {navItems.map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  activeView === view
                    ? 'bg-cyan-500 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {view}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
