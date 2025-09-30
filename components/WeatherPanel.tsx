import React from 'react';
import { WeatherIncident } from '../types';
import { SunIcon, CloudDrizzleIcon, WindIcon } from './icons';

interface WeatherPanelProps {
  incidents: WeatherIncident[];
}

const severityConfig: { [key in WeatherIncident['severity']]: { style: string; icon: (type: WeatherIncident['type']) => React.ReactNode } } = {
  Moderate: {
    style: 'border-yellow-500/50 bg-yellow-500/10',
    icon: (type: WeatherIncident['type']) => {
        if (type === 'High Winds') return <WindIcon className="h-6 w-6 text-yellow-400" />;
        if (type === 'Heavy Rain' || type === 'Snow') return <CloudDrizzleIcon className="h-6 w-6 text-yellow-400" />;
        return <SunIcon className="h-6 w-6 text-yellow-400" />;
    }
  },
  Severe: {
    style: 'border-orange-500/50 bg-orange-500/10',
    icon: (type: WeatherIncident['type']) => {
        if (type === 'High Winds') return <WindIcon className="h-6 w-6 text-orange-400" />;
        if (type === 'Heavy Rain' || type === 'Snow') return <CloudDrizzleIcon className="h-6 w-6 text-orange-400" />;
        return <SunIcon className="h-6 w-6 text-orange-400" />;
    }
  },
  Extreme: {
    style: 'border-red-500/50 bg-red-500/10',
    icon: (type: WeatherIncident['type']) => {
        if (type === 'High Winds') return <WindIcon className="h-6 w-6 text-red-400" />;
        if (type === 'Heavy Rain' || type === 'Snow') return <CloudDrizzleIcon className="h-6 w-6 text-red-400" />;
        return <SunIcon className="h-6 w-6 text-red-400" />;
    }
  },
};

export const WeatherPanel: React.FC<WeatherPanelProps> = ({ incidents }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-inner flex flex-col">
      <h2 className="text-lg font-semibold mb-4 text-white">Weather Advisories</h2>
      <div className="overflow-y-auto flex-grow space-y-4 pr-2">
        {incidents.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No active weather advisories.</p>
          </div>
        ) : (
          incidents.map(incident => {
            const config = severityConfig[incident.severity];
            return (
              <div key={incident.id} className={`p-3 rounded-lg border ${config.style}`}>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">{config.icon(incident.type)}</div>
                  <div>
                    <h3 className="font-semibold text-white">{incident.type} - <span className="text-gray-400">{incident.location}</span></h3>
                    <p className="text-sm text-gray-300 mt-1">{incident.description}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};