
import { GoogleGenAI } from "@google/genai";
import { GameState, RoleType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeGameState = async (state: GameState) => {
  if (!process.env.API_KEY) return "API Key not configured.";

  const gameDataSummary = state.rows.map(row => {
    const player = state.players.find(p => p.id === row.assignedPlayerId);
    return {
      role: row.role,
      player: player?.name || 'Unassigned',
      actions: row.nightActions,
      status: row.isAlive ? 'Alive' : 'Dead'
    };
  });

  const prompt = `
    You are a professional Mafia Game Narrator. 
    Analyze the current game state and provide a brief, dramatic summary of what's happening.
    Identify potential threats or interesting conflicts based on night actions.
    
    Current Game Data:
    ${JSON.stringify(gameDataSummary, null, 2)}
    
    Provide 3 key insights or predictions for the next day/night cycle in a cool, mysterious tone.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.8,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text || "No insights available.";
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return "The shadows are silent for now...";
  }
};
