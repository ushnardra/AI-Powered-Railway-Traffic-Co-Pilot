import React from 'react';
import { Train, Track } from '../types';
import { TrainIcon } from './icons';

interface TrackMapProps {
  trains: Train[];
  tracks: Track[];
}

const statusColors: { [key in Train['status']]: string } = {
  'On Time': 'text-green-400',
  Delayed: 'text-yellow-400',
  Stopped: 'text-red-500',
  'At Risk': 'text-orange-400',
};

export const TrackMap: React.FC<TrackMapProps> = ({ trains, tracks }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-inner h-1/2 flex flex-col">
      <h2 className="text-lg font-semibold mb-4 text-white">Digital Twin: Live Track View</h2>
      <div className="flex-grow space-y-8 overflow-y-auto pr-2 pt-4">
        {tracks.map(track => (
          <div key={track.id} className="relative">
            <div className="h-2 bg-gray-600 rounded-full flex items-center">
              <span className="absolute -left-10 text-sm font-mono text-gray-400">Track {track.id}</span>
            </div>
            {trains
              .filter(train => train.trackId === track.id)
              .map(train => (
                <div
                  key={train.id}
                  className="absolute top-1/2 -translate-y-1/2 transition-all duration-100 ease-linear transform -translate-x-1/2"
                  style={{ left: `${train.position}%` }}
                >
                  <div className="relative group flex flex-col items-center">
                    <TrainIcon className={`h-6 w-6 ${statusColors[train.status]}`} />
                    <span className="text-[10px] font-mono text-gray-300 mt-1 whitespace-nowrap">{train.id}</span>
                    <div className="absolute bottom-full mb-2 w-max -translate-x-1/2 left-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <strong>{train.name} ({train.id})</strong><br/>
                      To: {train.destination}<br/>
                      {train.speed} km/h - {train.status}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};
