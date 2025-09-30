
import { GoogleGenAI, Type } from '@google/genai';
import { Train, Track, Alert, AIRecommendation } from '../types';

// Per guidelines, API_KEY is assumed to be set in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recommendationSchema = {
    type: Type.OBJECT,
    properties: {
        action: {
            type: Type.STRING,
            description: "A concise, actionable instruction for the railway controller. E.g., 'Reroute Train T002 to Track 3 and reduce speed to 60 km/h'.",
        },
        reasoning: {
            type: Type.STRING,
            description: "A clear, detailed explanation for the recommendation, justifying why this action is optimal. Mention trade-offs and alternatives considered.",
        },
        policyScores: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, enum: ['Punctuality', 'Energy Efficiency', 'Passenger Comfort', 'Network Throughput'] },
                    score: { type: Type.NUMBER, description: "The new projected score (0-100) after the action." },
                    change: { type: Type.NUMBER, description: "The change from the current score (e.g., +5, -2)." },
                },
                required: ["name", "score", "change"]
            },
        },
    },
    required: ["action", "reasoning", "policyScores"],
};

export const getRecommendation = async (
  trains: Train[],
  tracks: Track[],
  alert: Alert
): Promise<AIRecommendation> => {
  const model = 'gemini-2.5-flash';

  const prompt = `
    You are an AI Co-Pilot for a railway section controller. Analyze the following real-time railway data and provide a recommendation to resolve the critical alert.

    **System State:**
    - **Active Trains:**
      ${trains.map(t => `- ID: ${t.id} (${t.name}), Track: ${t.trackId}, Position: ${t.position}%, Speed: ${t.speed}km/h, Status: ${t.status}, Priority: ${t.priority}, Destination: ${t.destination}`).join('\n      ')}
    - **Track Layout:**
      ${tracks.map(t => `- Track ID: ${t.id}, Length: ${t.length}km`).join('\n      ')}

    **Critical Alert:**
    - **Title:** ${alert.title}
    - **Description:** ${alert.description}
    - **Severity:** ${alert.severity}

    **Your Task:**
    Generate the best possible action to resolve this conflict. Prioritize safety, then high-priority train punctuality, then overall network efficiency. Your response must be a JSON object that adheres to the provided schema. Provide clear, justifiable reasoning for your decision.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recommendationSchema,
      },
    });

    const recommendationJson = JSON.parse(response.text);
    
    return {
      ...recommendationJson,
      id: `R-${Date.now()}`,
      relatedAlertId: alert.id,
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Fallback to a mock recommendation in case of an API error
    throw new Error('Failed to generate AI recommendation.');
  }
};

const scenarioAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        strategies: {
            type: Type.ARRAY,
            description: "A list of distinct mitigation strategies for the given disruption scenario.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "A short, descriptive title for the strategy." },
                    description: { type: Type.STRING, description: "A detailed description of the strategy and the actions it involves." },
                    pros: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of key advantages or pros for this strategy." },
                    cons: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of key disadvantages or cons for this strategy." },
                },
                required: ["title", "description", "pros", "cons"]
            }
        }
    },
    required: ["strategies"],
};

export const getScenarioAnalysis = async (
  trains: Train[],
  tracks: Track[],
  scenario: string
): Promise<{ strategies: any[] }> => {
  const model = 'gemini-2.5-flash';

  const prompt = `
    You are an expert railway operations strategist. Analyze the following real-time railway state and a hypothetical disruption scenario.
    Your task is to generate 2-3 distinct, high-level mitigation strategies. For each strategy, provide a title, a clear description, and a list of pros and cons.

    **Current System State:**
    - **Active Trains:**
      ${trains.map(t => `- ID: ${t.id} (${t.name}), Track: ${t.trackId}, Position: ${t.position}%, Speed: ${t.speed}km/h, Status: ${t.status}, Priority: ${t.priority}`).join('\n      ')}
    - **Track Layout:**
      ${tracks.map(t => `- Track ID: ${t.id}, Length: ${t.length}km`).join('\n      ')}

    **Hypothetical Disruption Scenario:**
    "${scenario}"

    Please provide your analysis as a JSON object adhering to the specified schema, containing a list of strategies.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: scenarioAnalysisSchema,
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error calling Gemini API for scenario analysis:", error);
    throw new Error('Failed to generate scenario analysis.');
  }
};


export const getWhatIfAnalysis = async (
  trains: Train[],
  tracks: Track[],
  alert: Alert,
  recommendation: AIRecommendation,
  whatIfQuery: string
): Promise<string> => {
  const model = 'gemini-2.5-flash';

  const prompt = `
    You are an AI Co-Pilot for a railway controller. My current situation involves an alert, and you have already provided a recommendation.
    I want to explore an alternative. Please analyze my "what-if" query and provide a concise response comparing my suggestion to your original recommendation.

    **Current System State:**
    - **Active Trains:**
      ${trains.map(t => `- ID: ${t.id}, Track: ${t.trackId}, Position: ${t.position}%, Speed: ${t.speed}km/h, Status: ${t.status}, Priority: ${t.priority}`).join('\n      ')}
    - **Track Layout:**
      ${tracks.map(t => `- Track ID: ${t.id}`).join('\n      ')}

    **Critical Alert:**
    - **Description:** ${alert.description}

    **Your Original Recommendation:**
    - **Action:** ${recommendation.action}
    - **Reasoning:** ${recommendation.reasoning}

    **My "What-If" Query:**
    "${whatIfQuery}"

    **Your Task:**
    Provide a concise analysis (2-3 sentences) of my query. Explain the likely consequences of my suggested action and compare its effectiveness against your original recommendation, considering factors like safety, punctuality, and network throughput.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for what-if analysis:", error);
    throw new Error('Failed to generate what-if analysis.');
  }
};
