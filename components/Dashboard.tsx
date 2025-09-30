import React, { useState, useEffect } from 'react';
import { TrackMap } from './TrackMap';
import { TrainList } from './TrainList';
import { AlertsPanel } from './AlertsPanel';
import { AuditLog } from './AuditLog';
import { ExplainableAIPanel } from './ExplainableAIPanel';
import { WeatherPanel } from './WeatherPanel';
import { Train, Track, Alert, AuditLogEntry, AIRecommendation, WeatherIncident } from '../types';
import { INITIAL_TRAINS, INITIAL_TRACKS, INITIAL_ALERT, INITIAL_AUDIT_LOGS, MOCK_AI_RECOMMENDATION, INITIAL_WEATHER_INCIDENTS } from '../constants';
import { getRecommendation } from '../services/geminiService';

const Dashboard: React.FC = () => {
  const [trains, setTrains] = useState<Train[]>(INITIAL_TRAINS);
  const [tracks] = useState<Track[]>(INITIAL_TRACKS);
  const [alerts, setAlerts] = useState<Alert[]>([INITIAL_ALERT]);
  const [weatherIncidents, setWeatherIncidents] = useState<WeatherIncident[]>(INITIAL_WEATHER_INCIDENTS);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendation | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  useEffect(() => {
    // Simulate live train movement
    const interval = setInterval(() => {
      setTrains(prevTrains =>
        prevTrains.map(train => {
          if (train.status !== 'Stopped') {
            const newPosition = (train.position + train.speed / 360) % 100;
            return { ...train, position: newPosition };
          }
          return train;
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);
  
  const handleAcknowledgeAlert = async (alertId: string) => {
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) return;
    
    addAuditLog('Controller acknowledged alert. Requesting AI recommendation.', 'Controller');
    setIsLoadingAi(true);
    
    try {
        const recommendation = await getRecommendation(trains, tracks, alert);
        setAiRecommendation(recommendation); 
    } catch (error) {
        console.error("Error getting AI recommendation:", error);
        addAuditLog('Failed to get AI recommendation. Using fallback.', 'System');
        // Fallback to mock if API fails
        setAiRecommendation(MOCK_AI_RECOMMENDATION);
    } finally {
        setIsLoadingAi(false);
    }
  };
  
  const addAuditLog = (message: string, author: 'System' | 'Controller' | 'AI') => {
    const newLogEntry: AuditLogEntry = {
      id: `L${Date.now()}`,
      timestamp: Date.now(),
      message,
      author,
    };
    setAuditLog(prev => [newLogEntry, ...prev]);
  };

  const handleRecommendationAction = (approved: boolean) => {
    if (aiRecommendation) {
        const message = approved ? `Approved AI recommendation: "${aiRecommendation.action}"` : 'Overrode AI recommendation.';
        addAuditLog(message, 'Controller');
        setAlerts(alerts => alerts.filter(a => a.id !== aiRecommendation.relatedAlertId));
        setAiRecommendation(null);
        // Here you would implement the state change based on the approved action
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
      <div className="lg:col-span-2 xl:col-span-3 space-y-6">
        <TrackMap trains={trains} tracks={tracks} />
        <TrainList trains={trains} />
      </div>

      <div className="lg:col-span-1 xl:col-span-1 flex flex-col space-y-6 h-full">
        <AlertsPanel alerts={alerts} onAcknowledge={handleAcknowledgeAlert} isLoadingAi={isLoadingAi} />
        <WeatherPanel incidents={weatherIncidents} />
        {aiRecommendation && (
            <ExplainableAIPanel
                recommendation={aiRecommendation}
                onAction={handleRecommendationAction}
                onClose={() => setAiRecommendation(null)}
                trains={trains}
                tracks={tracks}
                alerts={alerts}
            />
        )}
        <AuditLog entries={auditLog} />
      </div>
    </div>
  );
};

export default Dashboard;