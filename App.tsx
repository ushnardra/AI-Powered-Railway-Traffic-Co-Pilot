
import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import KpiDashboard from './components/KpiDashboard';
import ScenarioAnalysis from './components/ScenarioAnalysis';
import { View } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.Dashboard);

  const renderActiveView = () => {
    switch (activeView) {
      case View.Dashboard:
        return <Dashboard />;
      case View.KPIs:
        return <KpiDashboard />;
      case View.Scenarios:
        return <ScenarioAnalysis />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header activeView={activeView} setActiveView={setActiveView} />
      <main className="p-4 sm:p-6 lg:p-8">
        {renderActiveView()}
      </main>
    </div>
  );
};

export default App;
