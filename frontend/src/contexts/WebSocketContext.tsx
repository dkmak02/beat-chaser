'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { webSocketService, WebSocketMessage } from '@/services/WebSocketService';

interface WebSocketContextType {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  // Game-specific methods
  subscribeToGameEvents: (gameId: string, handler: (message: WebSocketMessage) => void) => () => void;
  sendGameMessage: (destination: string, payload: any) => void;
  // General WebSocket methods
  subscribe: (topic: string, handler: (message: WebSocketMessage) => void) => () => void;
  on: (eventType: string, handler: (message: WebSocketMessage) => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: React.ReactNode;
  autoConnect?: boolean;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ 
  children, 
  autoConnect = true 
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🚀 WebSocketProvider initializing...');

    // Set up event listeners
    const unsubscribeConnect = webSocketService.onConnect(() => {
      console.log('✅ WebSocket connected');
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
    });

    const unsubscribeDisconnect = webSocketService.onDisconnect(() => {
      console.log('❌ WebSocket disconnected');
      setIsConnected(false);
      setIsConnecting(false);
    });

    const unsubscribeError = webSocketService.onError((err) => {
      console.error('🚨 WebSocket error:', err);
      setError(err.message);
      setIsConnecting(false);
    });

    // Auto-connect if enabled
    if (autoConnect) {
      setIsConnecting(true);
      webSocketService.connect().catch((err) => {
        console.error('Failed to auto-connect:', err);
        setError(err.message);
        setIsConnecting(false);
      });
    }

    // Cleanup on unmount
    return () => {
      console.log('🧹 WebSocketProvider cleaning up...');
      unsubscribeConnect();
      unsubscribeDisconnect();
      unsubscribeError();
      webSocketService.disconnect();
    };
  }, [autoConnect]);

  const subscribeToGameEvents = (gameId: string, handler: (message: WebSocketMessage) => void) => {
    return webSocketService.subscribeToGame(gameId, handler);
  };

  const sendGameMessage = (destination: string, payload: any) => {
    webSocketService.send(destination, payload);
  };

  const subscribe = (topic: string, handler: (message: WebSocketMessage) => void) => {
    return webSocketService.subscribe(topic, handler);
  };

  const on = (eventType: string, handler: (message: WebSocketMessage) => void) => {
    return webSocketService.on(eventType, handler);
  };

  const contextValue: WebSocketContextType = {
    isConnected,
    isConnecting,
    error,
    subscribeToGameEvents,
    sendGameMessage,
    subscribe,
    on
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};
