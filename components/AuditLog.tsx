import React from 'react';
import { AuditLogEntry } from '../types';

const authorColors = {
  System: 'text-blue-400',
  Controller: 'text-green-400',
  AI: 'text-purple-400',
};

export const AuditLog: React.FC<{ entries: AuditLogEntry[] }> = ({ entries }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-inner flex flex-col flex-grow min-h-0">
      <h2 className="text-lg font-semibold mb-4 text-white">Audit Log</h2>
      <div className="overflow-y-auto flex-grow space-y-3 pr-2 text-sm">
        {entries.map(entry => (
          <div key={entry.id} className="flex items-start">
            <span className="text-gray-500 font-mono mr-3">
              {new Date(entry.timestamp).toLocaleTimeString()}
            </span>
            <p className="flex-1 text-gray-300">
              <span className={`font-semibold ${authorColors[entry.author]}`}>[{entry.author}]</span> {entry.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};