
import React, { useState } from 'react';
import { getScenarioAnalysis } from '../services/geminiService';
import { INITIAL_TRAINS, INITIAL_TRACKS } from '../constants';

const disruptionScenarios = [
  'Signal Failure at JX-07',
  'Track Maintenance on Track 2',
  'Medical Emergency on T003',
  'Unexpected Rolling Stock Fault on T005',
];

const StrategyCard: React.FC<{ title: string; description: string; pros: string[]; cons: string[] }> = ({ title, description, pros, cons }) => (
    <div className="bg-gray-800 rounded-lg p-4 animate-fade-in">
        <h4 className="font-bold text-cyan-400">{title}</h4>
        <p className="text-sm mt-2 text-gray-300">{description}</p>
        <div className="mt-4">
            <h5 className="font-semibold text-sm text-green-400">Pros</h5>
            <ul className="list-disc list-inside text-xs mt-1 space-y-1 text-gray-300">
                {pros.map((pro, i) => <li key={i}>{pro}</li>)}
            </ul>
        </div>
        <div className="mt-3">
            <h5 className="font-semibold text-sm text-red-400">Cons</h5>
            <ul className="list-disc list-inside text-xs mt-1 space-y-1 text-gray-300">
                {cons.map((con, i) => <li key={i}>{con}</li>)}
            </ul>
        </div>
    </div>
);

const ScenarioAnalysis: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<{ strategies: any[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = async () => {
    if (!selectedScenario) return;
    setLoading(true);
    setAnalysis(null);
    setError(null);

    try {
      // Use a snapshot of the system state for the simulation
      const result = await getScenarioAnalysis(INITIAL_TRAINS, INITIAL_TRACKS, selectedScenario);
      setAnalysis(result);
    } catch (e) {
      setError('Failed to retrieve AI analysis. Please try again later.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-white">Scenario Analysis Mode</h2>
        <p className="text-gray-400 mt-1">Simulate disruptions to test network resilience and compare AI-driven mitigation strategies.</p>
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
          <select
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value)}
            className="w-full sm:w-1/2 bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="" disabled>Select a disruption scenario...</option>
            {disruptionScenarios.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button
            onClick={handleSimulate}
            disabled={!selectedScenario || loading}
            className="w-full sm:w-auto px-6 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Simulating...' : 'Run Simulation'}
          </button>
        </div>
      </div>
      
      {loading && (
        <div className="text-center p-8 bg-gray-800 rounded-lg">
          <p className="text-lg text-cyan-400">Generating AI Strategies...</p>
          <p className="text-gray-400 mt-2">This may take a moment.</p>
        </div>
      )}

      {error && (
        <div className="text-center p-8 bg-red-900/50 border border-red-700 rounded-lg">
          <p className="text-lg text-red-400">Error</p>
          <p className="text-gray-300 mt-2">{error}</p>
        </div>
      )}

      {analysis && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Mitigation Strategies for "{selectedScenario}"</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analysis.strategies.map((s: any, i: number) => <StrategyCard key={i} {...s} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioAnalysis;
