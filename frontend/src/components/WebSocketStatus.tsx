'use client';

import { useWebSocketContext } from '@/contexts/WebSocketContext';

export const WebSocketStatus = () => {
  const { isConnected, isConnecting, error } = useWebSocketContext();

  if (isConnecting) {
    return (
      <div className="flex items-center gap-2 text-yellow-600">
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
        <span className="text-xs">Connecting...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <span className="text-xs">Connection Error</span>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-xs">Connected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-gray-400">
      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
      <span className="text-xs">Disconnected</span>
    </div>
  );
};
