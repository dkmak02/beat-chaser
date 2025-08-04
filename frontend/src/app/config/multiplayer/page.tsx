'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Play, Settings, Clock, Hash, Music2, Target, Users } from 'lucide-react';
import { useGameConfig } from '@/contexts/GameConfigContext';

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
  const [config, setConfig] = useState<GameConfig>({
    mode: 'multi',
    rounds: 10,
    difficulty: 'medium',
    category: 'mixed',
    timeLimit: 30,
    maxPlayers: 4
  });

  const handleSubmit = () => {
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
              <div className="flex items-center mb-4">
                <Users className="w-5 h-5 text-green-300 mr-2" />
                <h3 className="text-lg text-white">Maximum Players</h3>
                <div className="ml-auto bg-white/10 px-3 py-1 rounded-full text-sm text-white">
                  {config.maxPlayers} players
                </div>
              </div>
              <input
                type="range"
                min="2"
                max="8"
                value={config.maxPlayers}
                onChange={(e) => setConfig(prev => ({ ...prev, maxPlayers: parseInt(e.target.value) }))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-purple-200 mt-2">
                <span>2 players</span>
                <span>4 players (Recommended)</span>
                <span>8 players</span>
              </div>
            </div>

            {/* Difficulty & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <Target className="w-5 h-5 text-orange-300 mr-2" />
                  <h3 className="text-lg text-white">Difficulty Level</h3>
                </div>
                <select 
                  value={config.difficulty} 
                  onChange={(e) => setConfig(prev => ({ ...prev, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white text-sm focus:border-blue-400 transition-all duration-300"
                >
                  <option value="easy" className="bg-gray-800">Easy</option>
                  <option value="medium" className="bg-gray-800">Medium</option>
                  <option value="hard" className="bg-gray-800">Hard</option>
                </select>
                <p className="text-xs text-purple-200 mt-2 opacity-75">
                  {getDifficultyDescription(config.difficulty)}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <Music2 className="w-5 h-5 text-blue-300 mr-2" />
                  <h3 className="text-lg text-white">Music Category</h3>
                </div>
                <select 
                  value={config.category} 
                  onChange={(e) => setConfig(prev => ({ ...prev, category: e.target.value as 'pop' | 'rock' | 'classical' | 'mixed' }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white text-sm focus:border-blue-400 transition-all duration-300"
                >
                  <option value="mixed" className="bg-gray-800">🎵 Mixed Genres</option>
                  <option value="pop" className="bg-gray-800">🎤 Pop & Hip-Hop</option>
                  <option value="rock" className="bg-gray-800">🎸 Rock & Alternative</option>
                  <option value="classical" className="bg-gray-800">🎼 Classical & Orchestral</option>
                </select>
                <p className="text-xs text-purple-200 mt-2 opacity-75">
                  {getCategoryDescription(config.category)}
                </p>
              </div>
            </div>

            {/* Game Length */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
              <div className="flex items-center mb-4">
                <Hash className="w-5 h-5 text-green-300 mr-2" />
                <h3 className="text-lg text-white">Number of Rounds</h3>
                <div className="ml-auto bg-white/10 px-3 py-1 rounded-full text-sm text-white">
                  {config.rounds} rounds
                </div>
              </div>
              <input
                type="range"
                min="5"
                max="20"
                value={config.rounds}
                onChange={(e) => setConfig(prev => ({ ...prev, rounds: parseInt(e.target.value) }))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-purple-200 mt-2">
                <span>5 rounds (Quick)</span>
                <span>10 rounds (Standard)</span>
                <span>20 rounds (Marathon)</span>
              </div>
            </div>

            {/* Time Limit */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
              <div className="flex items-center mb-4">
                <Clock className="w-5 h-5 text-red-300 mr-2" />
                <h3 className="text-lg text-white">Time Limit per Question</h3>
                <div className="ml-auto bg-white/10 px-3 py-1 rounded-full text-sm text-white">
                  {config.timeLimit}s
                </div>
              </div>
              <input
                type="range"
                min="15"
                max="60"
                step="5"
                value={config.timeLimit}
                onChange={(e) => setConfig(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-purple-200 mt-2">
                <span>15s (Speed)</span>
                <span>30s (Standard)</span>
                <span>60s (Relaxed)</span>
              </div>
            </div>
          </div>

          {/* Summary Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-4 sticky top-6">
              <h3 className="text-lg text-white mb-4 text-center">Game Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-purple-200 text-sm">Mode:</span>
                  <span className="bg-blue-600/20 px-2 py-1 rounded text-xs text-blue-300 capitalize">
                    Multiplayer
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-200 text-sm">Players:</span>
                  <span className="bg-white/10 px-2 py-1 rounded text-xs text-white">
                    Up to {config.maxPlayers}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-200 text-sm">Difficulty:</span>
                  <span className={`px-2 py-1 rounded text-xs capitalize ${
                    config.difficulty === 'easy' ? 'bg-green-600/20 text-green-300' :
                    config.difficulty === 'medium' ? 'bg-yellow-600/20 text-yellow-300' :
                    'bg-red-600/20 text-red-300'
                  }`}>
                    {config.difficulty}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-200 text-sm">Category:</span>
                  <span className="bg-white/10 px-2 py-1 rounded text-xs text-white capitalize">
                    {config.category}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-200 text-sm">Rounds:</span>
                  <span className="bg-white/10 px-2 py-1 rounded text-xs text-white">
                    {config.rounds}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-200 text-sm">Time Limit:</span>
                  <span className="bg-white/10 px-2 py-1 rounded text-xs text-white">
                    {config.timeLimit}s
                  </span>
                </div>
              </div>

              <div className="border-t border-white/20 pt-4 mb-4">
                <div className="text-center text-xs text-purple-200 mb-1">Estimated Duration</div>
                <div className="text-xl text-center text-white">
                  ~{Math.ceil((config.rounds * config.timeLimit) / 60)} minutes
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => router.back()} 
                  className="w-full bg-white/10 border border-white/30 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Menu
                </button>
                <button 
                  onClick={handleSubmit} 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Create Room
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 