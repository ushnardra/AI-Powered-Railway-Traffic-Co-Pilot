import React from 'react';
import { Train } from '../types';

const statusStyles: { [key in Train['status']]: string } = {
    'On Time': 'bg-green-500/20 text-green-300',
    'Delayed': 'bg-yellow-500/20 text-yellow-300',
    'Stopped': 'bg-red-500/20 text-red-300',
    'At Risk': 'bg-orange-500/20 text-orange-300',
};

export const TrainList: React.FC<{ trains: Train[] }> = ({ trains }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-inner h-1/2 flex flex-col">
      <h2 className="text-lg font-semibold mb-4 text-white">Active Trains</h2>
      <div className="overflow-y-auto flex-grow">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-gray-700/50 sticky top-0">
            <tr>
              <th scope="col" className="px-4 py-3">ID</th>
              <th scope="col" className="px-4 py-3">Name</th>
              <th scope="col" className="px-4 py-3">Destination</th>
              <th scope="col" className="px-4 py-3">Speed</th>
              <th scope="col" className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {trains.map(train => (
              <tr key={train.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                <td className="px-4 py-3 font-mono">{train.id}</td>
                <td className="px-4 py-3 font-medium text-white">{train.name}</td>
                <td className="px-4 py-3">{train.destination}</td>
                <td className="px-4 py-3">{train.speed} km/h</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[train.status]}`}>
                    {train.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
