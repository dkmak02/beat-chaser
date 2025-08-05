'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Play, Settings, Clock, Hash, Music2, Target, Users, LogIn } from 'lucide-react';
import { useGameConfig } from '@/contexts/GameConfigContext';
import { useUser } from '@/contexts/UserContext';
import { Select, Slider } from 'antd';

interface GameConfig {
  mode: 'multi';
  rounds: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'pop' | 'rock' | 'classical' | 'mixed';
  timeLimit: number;
  maxPlayers: number;
}

export default function MultiplayerConfig() {
  const router = useRouter();
  const { setGameConfig } = useGameConfig();
  const { isLoggedIn, username } = useUser();
  const [config, setConfig] = useState<GameConfig>({
    mode: 'multi',
    rounds: 10,
    difficulty: 'medium',
    category: 'mixed',
    timeLimit: 30,
    maxPlayers: 4
  });

  // Redirect to home if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  const handleSubmit = () => {
    if (!isLoggedIn) {
      return;
    }
    // Save configuration to context
    setGameConfig({
      rounds: config.rounds,
      difficulty: config.difficulty,
      category: config.category,
      timeLimit: config.timeLimit,
      maxPlayers: config.maxPlayers,
      gameMode: 'multiplayer'
    });
    // Navigate to waiting room
    router.push('/game/waiting-room');
  };

  const getDifficultyDescription = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Popular hits with longer clips (20-30s)';
      case 'medium': return 'Mix of popular and deep cuts (15-25s)';
      case 'hard': return 'Obscure tracks with short clips (5-15s)';
      default: return '';
    }
  };

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case 'mixed': return 'All genres for maximum variety';
      case 'pop': return 'Pop, Hip-Hop, and contemporary hits';
      case 'rock': return 'Rock, Alternative, and Metal classics';
      case 'classical': return 'Classical, Orchestra, and Film scores';
      default: return '';
    }
  };

  // Show login required message if not logged in
  if (!isLoggedIn) {
    return (
      <div className="h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogIn className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl text-white mb-4">Login Required</h1>
            <p className="text-purple-200 text-lg mb-6">You need to be logged in to start a multiplayer game</p>
            <button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 overflow-hidden">
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => router.back()}
            className="text-white hover:bg-white/20 p-2 mr-4 transition-all duration-300 hover:scale-105 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl text-white mb-1 flex items-center">
              <Settings className="w-6 h-6 mr-3 text-blue-300" />
              Multiplayer Configuration
            </h1>
            <p className="text-purple-200 text-sm">Set up your multiplayer music battle</p>
            <p className="text-purple-300 text-sm">Logged in as: {username}</p>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
          {/* Settings Panel */}
          <div className="lg:col-span-2 space-y-4 overflow-y-auto">
            {/* Game Mode Card */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <Target className="w-5 h-5 text-blue-300 mr-2" />
                <h3 className="text-lg text-white">Game Mode</h3>
              </div>
              <div className="bg-blue-600/20 p-3 rounded-lg border border-blue-500/30">
                <div className="text-center">
                  <div className="text-lg text-blue-200">Multiplayer</div>
                  <div className="text-sm text-blue-300 opacity-75">Compete with friends</div>
                </div>
              </div>
            </div>

            {/* Player Count */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <Users className="w-5 h-5 text-green-300 mr-2" />
                <h3 className="text-lg text-white">Player Count</h3>
              </div>
              <div className="px-2">
                <Slider
                  min={2}
                  max={6}
                  step={1}
                  value={config.maxPlayers}
                  onChange={(value) => setConfig({ ...config, maxPlayers: value })}
                  marks={{
                    2: '2',
                    3: '3',
                    4: '4',
                    5: '5',
                    6: '6'
                  }}
                  tooltip={{
                    formatter: (value) => `${value} players`
                  }}
                />
                <div className="text-center text-purple-200 text-sm mt-2">
                  {config.maxPlayers} players
                </div>
              </div>
            </div>

            {/* Difficulty & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <Target className="w-5 h-5 text-orange-300 mr-2" />
                  <h3 className="text-lg text-white">Difficulty Level</h3>
                </div>
                <Select
                  value={config.difficulty}
                  onChange={(value) => setConfig({ ...config, difficulty: value as 'easy' | 'medium' | 'hard' })}
                  className="w-full"
                  options={[
                    { value: 'easy', label: 'Easy - Popular hits with longer clips (20-30s)' },
                    { value: 'medium', label: 'Medium - Mix of popular and deep cuts (15-25s)' },
                    { value: 'hard', label: 'Hard - Obscure tracks with short clips (5-15s)' }
                  ]}
                />
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <Music2 className="w-5 h-5 text-green-300 mr-2" />
                  <h3 className="text-lg text-white">Music Category</h3>
                </div>
                <Select
                  value={config.category}
                  onChange={(value) => setConfig({ ...config, category: value as 'pop' | 'rock' | 'classical' | 'mixed' })}
                  className="w-full"
                  options={[
                    { value: 'mixed', label: 'Mixed - All genres for maximum variety' },
                    { value: 'pop', label: 'Pop - Pop, Hip-Hop, and contemporary hits' },
                    { value: 'rock', label: 'Rock - Rock, Alternative, and Metal classics' },
                    { value: 'classical', label: 'Classical - Classical, Orchestra, and Film scores' }
                  ]}
                />
              </div>
            </div>

            {/* Game Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <Hash className="w-5 h-5 text-blue-300 mr-2" />
                  <h3 className="text-lg text-white">Number of Rounds</h3>
                </div>
                <div className="px-2">
                  <Slider
                    min={5}
                    max={20}
                    step={5}
                    value={config.rounds}
                    onChange={(value) => setConfig({ ...config, rounds: value })}
                    marks={{
                      5: '5',
                      10: '10',
                      15: '15',
                      20: '20'
                    }}
                    tooltip={{
                      formatter: (value) => `${value} rounds`
                    }}
                  />
                  <div className="text-center text-purple-200 text-sm mt-2">
                    {config.rounds} rounds
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <Clock className="w-5 h-5 text-yellow-300 mr-2" />
                  <h3 className="text-lg text-white">Time Limit</h3>
                </div>
                <div className="px-2">
                  <Slider
                    min={15}
                    max={60}
                    step={5}
                    value={config.timeLimit}
                    onChange={(value) => setConfig({ ...config, timeLimit: value })}
                    marks={{
                      15: '15s',
                      30: '30s',
                      45: '45s',
                      60: '60s'
                    }}
                    tooltip={{
                      formatter: (value) => `${value} seconds`
                    }}
                  />
                  <div className="text-center text-purple-200 text-sm mt-2">
                    {config.timeLimit} seconds
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 h-full">
              <h3 className="text-xl text-white mb-4 flex items-center">
                <Play className="w-5 h-5 text-green-300 mr-2" />
                Game Preview
              </h3>
              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-purple-200 font-medium">Mode</div>
                  <div className="text-white">Multiplayer</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-purple-200 font-medium">Players</div>
                  <div className="text-white">{config.maxPlayers}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-purple-200 font-medium">Difficulty</div>
                  <div className="text-white capitalize">{config.difficulty}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-purple-200 font-medium">Category</div>
                  <div className="text-white capitalize">{config.category}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-purple-200 font-medium">Rounds</div>
                  <div className="text-white">{config.rounds}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-purple-200 font-medium">Time Limit</div>
                  <div className="text-white">{config.timeLimit}s</div>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 px-6 rounded-xl font-medium mt-6 flex items-center justify-center"
              >
                <Play className="w-5 h-5 mr-2" />
                Create Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 