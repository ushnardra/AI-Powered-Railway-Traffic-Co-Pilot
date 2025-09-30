
import React, { useState } from 'react';
import { AIRecommendation, Train, Track, Alert } from '../types';
import { LightBulbIcon, CheckCircleIcon, XCircleIcon, XMarkIcon } from './icons';
import { getWhatIfAnalysis } from '../services/geminiService';

interface ExplainableAIPanelProps {
  recommendation: AIRecommendation;
  onAction: (approved: boolean) => void;
  onClose: () => void;
  trains: Train[];
  tracks: Track[];
  alerts: Alert[];
}

export const ExplainableAIPanel: React.FC<ExplainableAIPanelProps> = ({ recommendation, onAction, onClose, trains, tracks, alerts }) => {
    const [whatIfQuery, setWhatIfQuery] = useState('');
    const [whatIfResponse, setWhatIfResponse] = useState('');
    const [isWhatIfLoading, setIsWhatIfLoading] = useState(false);

    const handleWhatIfSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!whatIfQuery || isWhatIfLoading) return;

        const currentAlert = alerts.find(a => a.id === recommendation.relatedAlertId);
        if (!currentAlert) {
            setWhatIfResponse("Error: Could not find the related alert for this context.");
            return;
        }

        setIsWhatIfLoading(true);
        setWhatIfResponse('');
        
        try {
            const response = await getWhatIfAnalysis(trains, tracks, currentAlert, recommendation, whatIfQuery);
            setWhatIfResponse(response);
        } catch (error) {
            console.error(error);
            setWhatIfResponse("Sorry, I couldn't process that query. Please try again.");
        } finally {
            setIsWhatIfLoading(false);
        }
    };

    return (
        <div className="bg-gray-800/90 backdrop-blur-sm border border-cyan-500/30 p-4 rounded-lg shadow-2xl flex flex-col animate-fade-in">
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-2">
                    <LightBulbIcon className="h-6 w-6 text-cyan-400" />
                    <h2 className="text-lg font-semibold text-white">AI Recommendation</h2>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                    <XMarkIcon className="h-5 w-5" />
                </button>
            </div>
            
            <div className="flex-grow overflow-y-auto space-y-4 pr-2 text-sm">
                <div>
                    <h4 className="font-semibold text-cyan-400">Proposed Action</h4>
                    <p className="text-gray-200 mt-1">{recommendation.action}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-cyan-400">Reasoning</h4>
                    <p className="text-gray-300 mt-1">{recommendation.reasoning}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-cyan-400 mb-2">Policy Score Impact</h4>
                    <div className="space-y-1">
                        {recommendation.policyScores.map(ps => (
                            <div key={ps.name} className="flex justify-between items-center text-xs">
                                <span className="text-gray-300">{ps.name}</span>
                                <div className="flex items-center space-x-2">
                                    <span className={ps.change > 0 ? 'text-green-400' : ps.change < 0 ? 'text-red-400' : 'text-gray-400'}>
                                        {ps.change > 0 ? '+' : ''}{ps.change}
                                    </span>
                                    <span className="font-semibold text-white">{ps.score}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-cyan-400">What-if Simulation</h4>
                    <form onSubmit={handleWhatIfSubmit} className="flex items-center gap-2 mt-1">
                        <input
                            type="text"
                            value={whatIfQuery}
                            onChange={(e) => setWhatIfQuery(e.target.value)}
                            placeholder="e.g., What if we delay T001 instead?"
                            disabled={isWhatIfLoading}
                            className="w-full bg-gray-700 text-xs border border-gray-600 rounded-md py-1 px-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
                        />
                        <button type="submit" disabled={isWhatIfLoading} className="text-cyan-400 text-xs font-semibold disabled:opacity-50">
                            {isWhatIfLoading ? '...' : 'Ask'}
                        </button>
                    </form>
                    {(isWhatIfLoading || whatIfResponse) && (
                        <div className="text-xs text-gray-400 mt-2 p-2 bg-gray-700/50 rounded-md">
                            {isWhatIfLoading ? 'AI is analyzing your query...' : whatIfResponse}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-3 mt-4">
                <button onClick={() => onAction(true)} className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-500 transition-colors">
                    <CheckCircleIcon className="h-5 w-5" />
                    Approve
                </button>
                <button onClick={() => onAction(false)} className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-500 transition-colors">
                    <XCircleIcon className="h-5 w-5" />
                    Override
                </button>
            </div>
        </div>
    );
};
