'use client';

import { useEffect, useState, useCallback } from 'react';
import { webSocketService, WebSocketMessage } from '@/services/WebSocketService';

interface UseWebSocketReturn {
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  subscribeToGame: (gameId: string, handler: (message: WebSocketMessage) => void) => () => void;
  subscribe: (topic: string, handler: (message: WebSocketMessage) => void) => () => void;
  send: (destination: string, payload: any) => void;
  on: (eventType: string, handler: (message: WebSocketMessage) => void) => () => void;
}

export const useWebSocket = (): UseWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Update connection status
  const updateConnectionStatus = useCallback(() => {
    const status = webSocketService.getConnectionStatus();
    setIsConnected(status.isConnected);
    setIsConnecting(status.isConnecting);
  }, []);

  useEffect(() => {
    // Set up connection event listeners
    const unsubscribeConnect = webSocketService.onConnect(() => {
      console.log('🎯 WebSocket connected via hook');
      updateConnectionStatus();
    });

    const unsubscribeDisconnect = webSocketService.onDisconnect(() => {
      console.log('🎯 WebSocket disconnected via hook');
      updateConnectionStatus();
    });

    const unsubscribeError = webSocketService.onError((error) => {
      console.error('🎯 WebSocket error via hook:', error);
      updateConnectionStatus();
    });

    // Initial status check
    updateConnectionStatus();

    // Cleanup on unmount
    return () => {
      unsubscribeConnect();
      unsubscribeDisconnect();
      unsubscribeError();
    };
  }, [updateConnectionStatus]);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      await webSocketService.connect();
    } catch (error) {
      console.error('Failed to connect via hook:', error);
    } finally {
      updateConnectionStatus();
    }
  }, [updateConnectionStatus]);

  const disconnect = useCallback(() => {
    webSocketService.disconnect();
    updateConnectionStatus();
  }, [updateConnectionStatus]);

  const subscribeToGame = useCallback((gameId: string, handler: (message: WebSocketMessage) => void) => {
    return webSocketService.subscribeToGame(gameId, handler);
  }, []);

  const subscribe = useCallback((topic: string, handler: (message: WebSocketMessage) => void) => {
    return webSocketService.subscribe(topic, handler);
  }, []);

  const send = useCallback((destination: string, payload: any) => {
    webSocketService.send(destination, payload);
  }, []);

  const on = useCallback((eventType: string, handler: (message: WebSocketMessage) => void) => {
    return webSocketService.on(eventType, handler);
  }, []);

  return {
    isConnected,
    isConnecting,
    connect,
    disconnect,
    subscribeToGame,
    subscribe,
    send,
    on
  };
};
