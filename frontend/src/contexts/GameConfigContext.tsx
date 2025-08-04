'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface GameConfig {
  rounds: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'mixed' | 'rock' | 'pop' | 'jazz' | 'classical' | 'electronic';
  timeLimit: number;
  maxPlayers?: number; // For multiplayer
  gameMode: 'singleplayer' | 'multiplayer';
}

interface GameConfigContextType {
  gameConfig: GameConfig | null;
  setGameConfig: (config: GameConfig) => void;
  clearGameConfig: () => void;
  isConfigSet: boolean;
}

const GameConfigContext = createContext<GameConfigContextType | undefined>(undefined);

export function GameConfigProvider({ children }: { children: ReactNode }) {
  const [gameConfig, setGameConfigState] = useState<GameConfig | null>(null);

  const setGameConfig = (config: GameConfig) => {
    setGameConfigState(config);
    // Optionally save to localStorage for persistence
    localStorage.setItem('gameConfig', JSON.stringify(config));
  };

  const clearGameConfig = () => {
    setGameConfigState(null);
    localStorage.removeItem('gameConfig');
  };

  // Load config from localStorage on mount
  React.useEffect(() => {
    const savedConfig = localStorage.getItem('gameConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setGameConfigState(parsedConfig);
      } catch (error) {
        console.error('Failed to parse saved game config:', error);
        localStorage.removeItem('gameConfig');
      }
    }
  }, []);

  const value: GameConfigContextType = {
    gameConfig,
    setGameConfig,
    clearGameConfig,
    isConfigSet: gameConfig !== null,
  };

  return (
    <GameConfigContext.Provider value={value}>
      {children}
    </GameConfigContext.Provider>
  );
}

export function useGameConfig() {
  const context = useContext(GameConfigContext);
  if (context === undefined) {
    throw new Error('useGameConfig must be used within a GameConfigProvider');
  }
  return context;
} 