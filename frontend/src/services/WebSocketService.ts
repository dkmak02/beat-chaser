import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// Types matching your backend
export interface WebSocketMessage<T = any> {
  type: string;
  payload: T;
  timestamp: string;
}

export interface GameEvent<T = any> extends WebSocketMessage<T> {
  // Game-specific event types
}

type EventHandler<T = any> = (message: WebSocketMessage<T>) => void;
type ConnectionHandler = () => void;
type ErrorHandler = (error: Error) => void;

export class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private eventHandlers: Map<string, EventHandler[]> = new Map();
  private connectionHandlers: ConnectionHandler[] = [];
  private disconnectionHandlers: ConnectionHandler[] = [];
  private errorHandlers: ErrorHandler[] = [];
  
  private isConnected = false;
  private isConnecting = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;

  constructor(private wsUrl: string = 'http://localhost:8080/ws') {}

  /**
   * Connect to WebSocket server
   */
  async connect(): Promise<void> {
    if (this.isConnected || this.isConnecting) {
      console.log('WebSocket already connected or connecting');
      return;
    }

    this.isConnecting = true;
    
    try {
      console.log('🔌 Connecting to WebSocket at:', this.wsUrl);
      
      // Create STOMP client with SockJS (matches backend configuration)
      this.client = new Client({
        webSocketFactory: () => {
          return new SockJS(this.wsUrl);
        },
        debug: (str) => {
          console.log('📡 STOMP:', str);
        },
        onConnect: (frame) => {
          console.log('✅ WebSocket connected:', frame);
          this.isConnected = true;
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.connectionHandlers.forEach(handler => handler());
        },
        onDisconnect: (frame) => {
          console.log('❌ WebSocket disconnected:', frame);
          this.isConnected = false;
          this.isConnecting = false;
          this.disconnectionHandlers.forEach(handler => handler());
          this.attemptReconnect();
        },
        onStompError: (frame) => {
          console.error('💥 STOMP Error:', frame);
          const error = new Error(`STOMP Error: ${frame.headers['message'] || 'Unknown error'}`);
          this.errorHandlers.forEach(handler => handler(error));
          this.attemptReconnect();
        },
        onWebSocketError: (event) => {
          console.error('🚨 WebSocket Error:', event);
          const error = new Error('WebSocket connection error');
          this.errorHandlers.forEach(handler => handler(error));
        }
      });

      this.client.activate();
      
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.isConnecting = false;
      throw error;
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (!this.client) return;

    console.log('🔌 Disconnecting WebSocket...');
    
    // Unsubscribe from all topics
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions.clear();
    
    // Deactivate client
    this.client.deactivate();
    this.client = null;
    this.isConnected = false;
    this.isConnecting = false;
  }

  /**
   * Subscribe to a game session events
   */
  subscribeToGame(gameId: string, handler: EventHandler): () => void {
    const topic = `/topic/game-${gameId}/events`;
    return this.subscribe(topic, handler);
  }

  /**
   * Subscribe to general topic
   */
  subscribe(topic: string, handler: EventHandler): () => void {
    if (!this.isConnected || !this.client) {
      console.warn('⚠️ Cannot subscribe: WebSocket not connected');
      throw new Error('WebSocket not connected');
    }

    console.log('📥 Subscribing to topic:', topic);
    
    const subscription = this.client.subscribe(topic, (message: IMessage) => {
      try {
        const data: WebSocketMessage = JSON.parse(message.body);
        console.log('📨 Received message from', topic, ':', data);
        handler(data);
        
        // Also trigger type-specific handlers
        this.triggerEventHandlers(data.type, data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    });

    this.subscriptions.set(topic, subscription);
    
    // Return unsubscribe function
    return () => {
      subscription.unsubscribe();
      this.subscriptions.delete(topic);
      console.log('📤 Unsubscribed from topic:', topic);
    };
  }

  /**
   * Send message to server (app destination)
   */
  send(destination: string, payload: any): void {
    if (!this.isConnected || !this.client) {
      console.warn('⚠️ Cannot send message: WebSocket not connected');
      return;
    }

    const message = {
      type: destination.replace('/app/', ''),
      payload,
      timestamp: new Date().toISOString()
    };

    console.log('📤 Sending message to', destination, ':', message);
    
    this.client.publish({
      destination,
      body: JSON.stringify(message)
    });
  }

  /**
   * Register event handler for specific event types
   */
  on(eventType: string, handler: EventHandler): () => void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    
    this.eventHandlers.get(eventType)!.push(handler);
    
    // Return unsubscribe function
    return () => {
      const handlers = this.eventHandlers.get(eventType);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  /**
   * Register connection event handlers
   */
  onConnect(handler: ConnectionHandler): () => void {
    this.connectionHandlers.push(handler);
    return () => {
      const index = this.connectionHandlers.indexOf(handler);
      if (index > -1) this.connectionHandlers.splice(index, 1);
    };
  }

  onDisconnect(handler: ConnectionHandler): () => void {
    this.disconnectionHandlers.push(handler);
    return () => {
      const index = this.disconnectionHandlers.indexOf(handler);
      if (index > -1) this.disconnectionHandlers.splice(index, 1);
    };
  }

  onError(handler: ErrorHandler): () => void {
    this.errorHandlers.push(handler);
    return () => {
      const index = this.errorHandlers.indexOf(handler);
      if (index > -1) this.errorHandlers.splice(index, 1);
    };
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): { isConnected: boolean; isConnecting: boolean } {
    return {
      isConnected: this.isConnected,
      isConnecting: this.isConnecting
    };
  }

  private triggerEventHandlers(eventType: string, data: WebSocketMessage): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${eventType}:`, error);
        }
      });
    }
  }

  private async attemptReconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * this.reconnectAttempts;
    
    console.log(`🔄 Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      if (!this.isConnected) {
        this.connect().catch(error => {
          console.error('Reconnection failed:', error);
        });
      }
    }, delay);
  }
}

// Create singleton instance
export const webSocketService = new WebSocketService(
  process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080/ws'
);
