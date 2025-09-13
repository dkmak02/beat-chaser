import { useMutation } from '@tanstack/react-query';
import { 
  createSingleplayerGame, 
  createMultiplayerGame, 
  joinGame,
  startGame,
  CreateGameRequest, 
  CreateMultiplayerGameRequest, 
  JoinGameRequest,
  StartGameRequest,
  CreateGameResponse,
  JoinGameResponse,
  StartGameResponse
} from '@/services/gameApi';

/**
 * Hook for creating a singleplayer game
 */
export const useCreateSingleplayerGame = () => {
  return useMutation<CreateGameResponse, Error, CreateGameRequest>({
    mutationFn: createSingleplayerGame,
    onSuccess: (data) => {
      console.log('✅ Singleplayer game created successfully:', data);
    },
    onError: (error) => {
      console.error('❌ Failed to create singleplayer game:', error);
    }
  });
};

/**
 * Hook for creating a multiplayer game
 */
export const useCreateMultiplayerGame = () => {
  return useMutation<CreateGameResponse, Error, CreateMultiplayerGameRequest>({
    mutationFn: createMultiplayerGame,
    onSuccess: (data) => {
      console.log('✅ Multiplayer game created successfully:', data);
    },
    onError: (error) => {
      console.error('❌ Failed to create multiplayer game:', error);
    }
  });
};

/**
 * Hook for joining an existing game
 */
export const useJoinGame = () => {
  return useMutation<JoinGameResponse, Error, JoinGameRequest>({
    mutationFn: joinGame,
    onSuccess: (data) => {
      console.log('✅ Joined game successfully:', data);
    },
    onError: (error) => {
      console.error('❌ Failed to join game:', error);
    }
  });
};

/**
 * Hook for starting an existing game
 */
export const useStartGame = () => {
  return useMutation<StartGameResponse, Error, StartGameRequest>({
    mutationFn: startGame,
    onSuccess: (data) => {
      console.log('✅ Game started successfully:', data);
    },
    onError: (error) => {
      console.error('❌ Failed to start game:', error);
    }
  });
};
