import React from 'react';
import { Alert } from '../types';
import { BellIcon, BoltIcon, InfoIcon } from './icons';

interface AlertsPanelProps {
  alerts: Alert[];
  onAcknowledge: (alertId: string) => void;
  isLoadingAi: boolean;
}

const severityConfig = {
  Critical: {
    icon: <BoltIcon className="h-6 w-6 text-red-400" />,
    style: 'border-red-500/50 bg-red-500/10',
  },
  Warning: {
    icon: <BellIcon className="h-6 w-6 text-yellow-400" />,
    style: 'border-yellow-500/50 bg-yellow-500/10',
  },
  Info: {
    icon: <InfoIcon className="h-6 w-6 text-blue-400" />,
    style: 'border-blue-500/50 bg-blue-500/10',
  },
};

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, onAcknowledge, isLoadingAi }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-inner flex flex-col">
      <h2 className="text-lg font-semibold mb-4 text-white">Active Alerts</h2>
      <div className="overflow-y-auto flex-grow space-y-4 pr-2">
        {alerts.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No active alerts.</p>
          </div>
        ) : (
          alerts.map(alert => {
            const config = severityConfig[alert.severity];
            return (
              <div key={alert.id} className={`p-3 rounded-lg border ${config.style}`}>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">{config.icon}</div>
                  <div>
                    <h3 className="font-semibold text-white">{alert.title}</h3>
                    <p className="text-sm text-gray-300 mt-1">{alert.description}</p>
                    <button
                      onClick={() => onAcknowledge(alert.id)}
                      disabled={isLoadingAi}
                      className="mt-3 text-sm font-semibold text-cyan-400 hover:text-cyan-300 disabled:opacity-50 disabled:cursor-wait"
                    >
                      {isLoadingAi ? 'Getting Recommendation...' : 'Acknowledge & Get AI Assist'}
                    </button>
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