export enum View {
  Dashboard = 'Dashboard',
  KPIs = 'KPIs',
  Scenarios = 'Scenarios',
}

export interface Train {
  id: string;
  name: string;
  speed: number; // in km/h
  position: number; // percentage along the track
  trackId: number;
  status: 'On Time' | 'Delayed' | 'Stopped' | 'At Risk';
  destination: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface Track {
  id: number;
  length: number; // in km
}

export interface Alert {
  id: string;

  title: string;
  description: string;
  severity: 'Critical' | 'Warning' | 'Info';
  timestamp: number;
  relatedTrains: string[];
}

export interface WeatherIncident {
  id: string;
  type: 'High Winds' | 'Heavy Rain' | 'Extreme Heat' | 'Snow';
  severity: 'Moderate' | 'Severe' | 'Extreme';
  location: string; // e.g., "Track 2 (km 45-55)"
  description: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  message: string;
  author: 'System' | 'Controller' | 'AI';
}

export interface PolicyScore {
  name: 'Punctuality' | 'Energy Efficiency' | 'Passenger Comfort' | 'Network Throughput';
  score: number; // 0-100
  change: number; // e.g., +5, -2
}

export interface AIRecommendation {
  id: string;
  action: string;
  reasoning: string;
  policyScores: PolicyScore[];
  relatedAlertId: string;
}