import { Train, Track, Alert, AuditLogEntry, PolicyScore, WeatherIncident } from './types';

export const INITIAL_TRACKS: Track[] = [
  { id: 1, length: 100 },
  { id: 2, length: 100 },
  { id: 3, length: 80 },
];

export const INITIAL_TRAINS: Train[] = [
  { id: 'T001', name: 'Express 745', speed: 120, position: 20, trackId: 1, status: 'On Time', destination: 'Central Station', priority: 'High' },
  { id: 'T002', name: 'Cargo 921', speed: 80, position: 65, trackId: 1, status: 'On Time', destination: 'North Yard', priority: 'Medium' },
  { id: 'T003', name: 'Local 303', speed: 90, position: 40, trackId: 2, status: 'On Time', destination: 'West Suburb', priority: 'Low' },
  { id: 'T004', name: 'Metro 112', speed: 110, position: 80, trackId: 2, status: 'Delayed', destination: 'East Hub', priority: 'High' },
  { id: 'T005', name: 'Freight 550', speed: 70, position: 15, trackId: 3, status: 'Stopped', destination: 'South Port', priority: 'Medium' },
];

export const INITIAL_ALERT: Alert = {
  id: 'A001',
  title: 'Potential Conflict',
  description: 'Train T001 and T002 are on a converging path on Track 1. Estimated time to conflict: 15 minutes.',
  severity: 'Critical',
  timestamp: Date.now(),
  relatedTrains: ['T001', 'T002'],
};

export const INITIAL_WEATHER_INCIDENTS: WeatherIncident[] = [
  {
    id: 'W001',
    type: 'High Winds',
    severity: 'Severe',
    location: 'Section A (Tracks 1 & 2)',
    description: 'Gusts up to 80 km/h. Speed restrictions advised for high-sided wagons.',
  },
  {
    id: 'W002',
    type: 'Heavy Rain',
    severity: 'Moderate',
    location: 'South Corridor (Track 3)',
    description: 'Reduced visibility and potential for track slippage. Caution advised.',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  { id: 'L001', timestamp: Date.now() - 5000, message: 'System initialized. Monitoring 5 active trains.', author: 'System' },
  { id: 'L002', timestamp: Date.now() - 3000, message: 'Train T004 status changed to Delayed.', author: 'System' },
  { id: 'L003', timestamp: Date.now() - 1000, message: 'Potential conflict detected for T001 & T002.', author: 'System' },
];

export const MOCK_AI_RECOMMENDATION = {
  id: 'R001',
  action: 'Reroute T002 to Track 3 at junction X15 and reduce speed to 60 km/h.',
  reasoning: 'Rerouting T002, a lower priority cargo train, avoids conflict with high-priority Express T001, maintaining its schedule. This solution minimizes overall network delay and has a negligible impact on energy consumption. The alternative of stopping T001 would cause significant passenger disruption.',
  policyScores: [
    { name: 'Punctuality', score: 92, change: -2 },
    { name: 'Network Throughput', score: 88, change: 5 },
    { name: 'Energy Efficiency', score: 75, change: -1 },
    { name: 'Passenger Comfort', score: 95, change: 0 },
  ] as PolicyScore[],
  relatedAlertId: 'A001',
};