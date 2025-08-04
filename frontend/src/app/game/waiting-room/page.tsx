'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Play, Users, Copy, Share2, Settings, Clock, Music2, Target, Hash, Trophy, Crown } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  isHost: boolean;
  isReady: boolean;
  avatar?: string;
}

interface GameConfig {
  mode: 'multi';
  rounds: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'pop' | 'rock' | 'classical' | 'mixed';
  timeLimit: number;
  maxPlayers: number;
}

export default function WaitingRoom() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('ABC123');
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'You', isHost: true, isReady: true },
    { id: '2', name: 'Alice', isHost: false, isReady: true },
    { id: '3', name: 'Bob', isHost: false, isReady: false },
  ]);
  const [config] = useState<GameConfig>({
    mode: 'multi',
    rounds: 10,
    difficulty: 'medium',
    category: 'mixed',
    timeLimit: 30,
    maxPlayers: 4
  });
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy room code:', err);
    }
  };

  const shareRoom = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my Beat Chaser game!',
          text: `Join my music guessing game! Room code: ${roomCode}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Failed to share:', err);
      }
    } else {
      copyRoomCode();
    }
  };

  const startGame = () => {
    // Check if all players are ready
    const allReady = players.every(player => player.isReady);
    if (allReady && players.length >= 2) {
      setCountdown(5);
    }
  };

  const leaveRoom = () => {
    router.push('/');
  };

  // Countdown effect
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      router.push('/game');
    }
  }, [countdown, router]);

  const readyPlayers = players.filter(p => p.isReady).length;
  const canStart = readyPlayers >= 2 && readyPlayers === players.length;

  return (
    <div className="h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 overflow-hidden">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button 
              onClick={leaveRoom}
              className="text-white hover:bg-white/20 p-2 mr-4 transition-all duration-300 hover:scale-105 rounded-lg"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl text-white mb-1 flex items-center">
                <Users className="w-6 h-6 mr-3 text-blue-300" />
                Waiting Room
              </h1>
              <p className="text-purple-200 text-sm">Waiting for players to join...</p>
            </div>
          </div>
          
          {/* Room Code */}
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3">
              <div className="text-center">
                <p className="text-xs text-purple-200 mb-1">Room Code</p>
                <p className="text-2xl font-mono text-white font-bold">{roomCode}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button 
                onClick={copyRoomCode}
                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-all duration-300 hover:scale-105"
                title="Copy room code"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button 
                onClick={shareRoom}
                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-all duration-300 hover:scale-105"
                title="Share room"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Countdown Overlay */}
        {countdown !== null && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-center">
              <div className="text-8xl text-white font-bold mb-4 animate-pulse">
                {countdown}
              </div>
              <p className="text-2xl text-purple-200">Game starting...</p>
            </div>
          </div>
        )}

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
          {/* Players List */}
          <div className="lg:col-span-2 space-y-4 overflow-y-auto">
            {/* Players */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl text-white flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Players ({players.length}/{config.maxPlayers})
                </h3>
                <div className="text-sm text-purple-200">
                  {readyPlayers}/{players.length} ready
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {players.map((player) => (
                  <div 
                    key={player.id}
                    className={`p-4 rounded-lg border transition-all duration-300 ${
                      player.isReady 
                        ? 'bg-green-600/20 border-green-500/30' 
                        : 'bg-white/5 border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            player.isHost ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}>
                            {player.isHost ? (
                              <Crown className="w-5 h-5 text-white" />
                            ) : (
                              <span className="text-white font-semibold">
                                {player.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          {player.isReady && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium flex items-center gap-2">
                            {player.name}
                            {player.isHost && (
                              <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">
                                Host
                              </span>
                            )}
                          </p>
                          <p className={`text-xs ${
                            player.isReady ? 'text-green-300' : 'text-gray-400'
                          }`}>
                            {player.isReady ? 'Ready' : 'Not ready'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty slots */}
              {players.length < config.maxPlayers && (
                <div className="mt-4">
                  <p className="text-sm text-purple-200 mb-3">Waiting for more players...</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: config.maxPlayers - players.length }).map((_, index) => (
                      <div 
                        key={index}
                        className="p-4 rounded-lg border border-white/10 bg-white/5 flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                          <span className="text-white/30 text-lg">?</span>
                        </div>
                        <div>
                          <p className="text-white/50 font-medium">Waiting...</p>
                          <p className="text-xs text-gray-400">Player joining</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Game Settings Preview */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <h3 className="text-xl text-white mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Game Settings
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-2xl text-blue-300 mb-1">{config.rounds}</div>
                  <div className="text-xs text-purple-200">Rounds</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-2xl text-orange-300 mb-1 capitalize">{config.difficulty}</div>
                  <div className="text-xs text-purple-200">Difficulty</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-2xl text-green-300 mb-1 capitalize">{config.category}</div>
                  <div className="text-xs text-purple-200">Category</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-2xl text-red-300 mb-1">{config.timeLimit}s</div>
                  <div className="text-xs text-purple-200">Time Limit</div>
                </div>
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 sticky top-6">
              <h3 className="text-lg text-white mb-6 text-center">Room Controls</h3>
              
              {/* Status */}
              <div className="space-y-4 mb-6">
                <div className="text-center p-4 bg-white/10 rounded-lg">
                  <div className="text-2xl text-white mb-1">{readyPlayers}/{players.length}</div>
                  <div className="text-sm text-purple-200">Players Ready</div>
                </div>
                
                <div className="text-center p-4 bg-white/10 rounded-lg">
                  <div className="text-2xl text-white mb-1">
                    ~{Math.ceil((config.rounds * config.timeLimit) / 60)}
                  </div>
                  <div className="text-sm text-purple-200">Minutes</div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button 
                  onClick={leaveRoom} 
                  className="w-full bg-white/10 border border-white/30 hover:bg-white/20 text-white py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Leave Room
                </button>
                
                <button 
                  onClick={startGame}
                  disabled={!canStart}
                  className={`w-full py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center ${
                    canStart 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:scale-105 shadow-lg' 
                      : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Play className="w-5 h-5 mr-2" />
                  {canStart ? 'Start Game' : 'Waiting for players...'}
                </button>
              </div>

              {/* Instructions */}
              <div className="mt-6 p-4 bg-blue-600/20 rounded-lg border border-blue-500/30">
                <h4 className="text-sm text-blue-200 font-semibold mb-2">How to invite friends:</h4>
                <ul className="text-xs text-blue-100 space-y-1">
                  <li>• Share the room code: <strong>{roomCode}</strong></li>
                  <li>• Or click the share button above</li>
                  <li>• All players must be ready to start</li>
                  <li>• Minimum 2 players required</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 