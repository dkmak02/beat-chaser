import { apiClient } from './apiClient';

// Helper function to get token from cookies
const getAuthToken = (): string | null => {
  if (typeof document === 'undefined') return null; // SSR check
  
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => 
    cookie.trim().startsWith('authToken=')
  );
  
  return tokenCookie ? tokenCookie.split('=')[1] : null;
};

export interface CreateGameResponse {
  id: string;
  totalRounds: number;
  createdAt: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  durationSeconds: number;
  audioPreviewUrl: string;
}

export interface CreateGameRequest {
  playerId: string;
  rounds: number;
}

export interface CreateMultiplayerGameRequest {
  playerId: string;
  rounds: number;
  maxPlayers?: number;
}

export interface JoinGameRequest {
  gameId: string;
  playerId: string;
}

export interface JoinGameResponse {
  gameId: string;
  userId: string;
  isHost: boolean;
  isReady: boolean;
  score: number;
  joinedAt: string;
}

export interface StartGameRequest {
  gameId: string;
}

export interface GamePlayer {
  gameId: string;
  userId: string;
  isHost: boolean;
  isReady: boolean;
  score: number;
  joinedAt: string;
}

export interface StartGameResponse {
  startTime: string;
  players: GamePlayer[];
}

/**
 * Create a singleplayer game
 */
export const createSingleplayerGame = async (request: CreateGameRequest): Promise<CreateGameResponse> => {
  const token = getAuthToken();
  console.log('🎯 Creating singleplayer game with token:', token ? 'Present' : 'Missing');
  
  const response = await apiClient.post(
    `/api/game/create/singleplayer`,
    null,
    {
      params: {
        playerId: request.playerId,
        rounds: request.rounds
      },
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      }
    }
  );
  return response.data;
};

/**
 * Create a multiplayer game
 */
export const createMultiplayerGame = async (request: CreateMultiplayerGameRequest): Promise<CreateGameResponse> => {
  const token = getAuthToken();
  console.log('🎯 Creating multiplayer game with token:', token ? 'Present' : 'Missing');
  
  const response = await apiClient.post(
    `/api/game/create/multiplayer`,
    null,
    {
      params: {
        playerId: request.playerId,
        rounds: request.rounds,
        maxPlayers: request.maxPlayers || 4
      },
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      }
    }
  );
  return response.data;
};

/**
 * Join an existing game
 */
export const joinGame = async (request: JoinGameRequest): Promise<JoinGameResponse> => {
  const token = getAuthToken();
  console.log('🎯 Joining game with token:', token ? 'Present' : 'Missing');
  console.log('🎯 Join request:', request);
  
  const response = await apiClient.post(
    `/api/game/join`,
    null,
    {
      params: {
        gameId: request.gameId,
        playerId: request.playerId
      },
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      }
    }
  );
  return response.data;
};

/**
 * Start an existing game
 */
export const startGame = async (request: StartGameRequest): Promise<StartGameResponse> => {
  const token = getAuthToken();
  console.log('🎯 Starting game with token:', token ? 'Present' : 'Missing');
  console.log('🎯 Start game request:', request);
  
  const response = await apiClient.post(
    `/api/game/start`,
    null,
    {
      params: {
        gameId: request.gameId
      },
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      }
    }
  );
  return response.data;
};

// Get all songs
export const getAllSongs = async (): Promise<Song[]> => {
  const token = getAuthToken();
  
  console.log('🎵 Fetching all songs from API');
  
  const response = await apiClient.get(
    `/api/song`,
    {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      }
    }
  );
  
  console.log('🎵 Songs received:', response.data);
  return response.data;
};
