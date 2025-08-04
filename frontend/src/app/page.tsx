'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Music, Users, User, HelpCircle, Star, Headphones, Award } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameOver'>('menu');
  const [gameResults, setGameResults] = useState<{ finalScore: number; totalRounds: number } | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleMessage = (message: string) => {
    setMessages(prev => [...prev, message]);
  };

  const handleConnectionChange = (connected: boolean) => {
    setIsConnected(connected);
  };

  const handleGameOver = (finalScore: number, totalRounds: number) => {
    setGameResults({ finalScore, totalRounds });
    setGameState('gameOver');
  };

  const handlePlayAgain = () => {
    setMessages([]);
    setGameState('menu');
    setGameResults(null);
  };

  const handleBackToMenu = () => {
    setMessages([]);
    setGameState('menu');
    setGameResults(null);
  };

  const handleStartGame = (mode: 'singleplayer' | 'multiplayer') => {
    router.push(`/config/${mode}`);
  };

  // Show playing state
  if (gameState === 'playing') {
    return (
      <div className="h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 overflow-hidden">
        <div className="max-w-6xl mx-auto h-full">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-white mb-1">🎵 Beat Chaser</h1>
            <p className="text-gray-300 text-base">Test your music knowledge!</p>
          </div>
        </div>
      </div>
    );
  }

  // Show main menu (compact for full HD)
  return (
    <div className="h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />
      <div className="absolute inset-0">
        {/* Floating music notes animation */}
        <div className="absolute top-16 left-8 text-purple-300/20 animate-bounce">
          <Music className="w-6 h-6" />
        </div>
        <div className="absolute top-32 right-16 text-blue-300/20 animate-pulse">
          <Headphones className="w-5 h-5" />
        </div>
        <div className="absolute bottom-32 left-16 text-indigo-300/20 animate-bounce delay-1000">
          <Star className="w-4 h-4" />
        </div>
        <div className="absolute bottom-16 right-32 text-purple-300/20 animate-pulse delay-500">
          <Award className="w-6 h-6" />
        </div>
      </div>

      <div className="relative z-10 h-screen flex flex-col items-center justify-center p-6">
        {/* Hero Section */}
        <div className="text-center mb-8 max-w-3xl">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Music className="w-16 h-16 text-purple-300 mr-4 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                <Star className="w-2 h-2 text-yellow-900" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                Beat Chaser
              </h1>
              <div className="flex items-center justify-center mt-1 gap-1">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-300" />
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse delay-600" />
              </div>
            </div>
          </div>
          
          <p className="text-lg text-purple-200 mb-3 leading-relaxed">
            Test your musical knowledge with the ultimate music guessing challenge
          </p>
          <p className="text-sm text-purple-300/80 max-w-xl mx-auto">
            Listen to song clips, guess the artist and title, compete with friends, and climb the leaderboards!
          </p>
        </div>

        {/* Game Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 max-w-2xl w-full">
          <div 
            className={`
              relative overflow-hidden cursor-pointer group
              transition-all duration-500 ease-out
              ${hoveredCard === 'single' ? 'scale-105 shadow-2xl shadow-purple-500/25' : ''}
              bg-gradient-to-br from-white/15 to-white/5 
              backdrop-blur-md border border-white/20 hover:border-purple-300/50
              rounded-xl p-6 text-center
            `}
            onClick={() => handleStartGame('singleplayer')}
            onMouseEnter={() => setHoveredCard('single')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="relative mb-4">
                <User className="w-12 h-12 text-purple-300 mx-auto transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform rotate-12">
                  <span className="text-white text-xs">1</span>
                </div>
              </div>
              <h3 className="text-2xl mb-3 group-hover:text-purple-200 transition-colors">Single Player</h3>
              <p className="text-purple-200 text-sm leading-relaxed">
                Challenge yourself solo and track your personal best scores across different genres and difficulties
              </p>
              <div className="mt-4 flex justify-center">
                <div className="px-3 py-1 bg-purple-500/20 rounded-full">
                  <span className="text-purple-300 text-xs">Perfect for practice</span>
                </div>
              </div>
            </div>
          </div>

          <div 
            className={`
              relative overflow-hidden cursor-pointer group
              transition-all duration-500 ease-out
              ${hoveredCard === 'multi' ? 'scale-105 shadow-2xl shadow-blue-500/25' : ''}
              bg-gradient-to-br from-white/15 to-white/5 
              backdrop-blur-md border border-white/20 hover:border-blue-300/50
              rounded-xl p-6 text-center
            `}
            onClick={() => handleStartGame('multiplayer')}
            onMouseEnter={() => setHoveredCard('multi')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="relative mb-4">
                <Users className="w-12 h-12 text-blue-300 mx-auto transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform -rotate-12">
                  <span className="text-white text-xs">2+</span>
                </div>
              </div>
              <h3 className="text-2xl mb-3 group-hover:text-blue-200 transition-colors">Multiplayer</h3>
              <p className="text-purple-200 text-sm leading-relaxed">
                Battle friends in real-time music competitions and see who has the most impressive musical knowledge
              </p>
              <div className="mt-4 flex justify-center">
                <div className="px-3 py-1 bg-blue-500/20 rounded-full">
                  <span className="text-blue-300 text-xs">Compete & conquer</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-4">
          <button 
            onClick={() => setShowHelpModal(true)}
            className="bg-white/10 border border-white/30 hover:bg-white/20 text-white px-6 py-3 text-base transition-all duration-300 hover:scale-105 rounded-lg flex items-center"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            How to Play
          </button>
        </div>

        {/* Help Modal */}
        {showHelpModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700 text-white max-w-2xl w-full rounded-xl p-6 max-h-[80vh] overflow-y-auto">
              <div className="text-center mb-4">
                <h2 className="text-2xl text-purple-300 mb-3">How to Play Beat Chaser</h2>
                <button 
                  onClick={() => setShowHelpModal(false)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
                  <h4 className="font-semibold text-lg mb-3 text-purple-300 flex items-center">
                    <Music className="w-5 h-5 mr-2" />
                    Game Rules
                  </h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      Listen to short clips of songs (5-30 seconds)
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      Guess the song title and artist within the time limit
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      Earn points for correct answers and speed
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      Partial credit for getting either title or artist correct
                    </li>
                  </ul>
                </div>
                
                <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                  <h4 className="font-semibold text-lg mb-3 text-blue-300 flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    Scoring System
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-gray-300 text-sm">
                    <div className="text-center p-2 bg-green-900/20 rounded border border-green-500/30">
                      <div className="text-xl text-green-400 mb-1">100</div>
                      <div className="text-xs">Perfect Match</div>
                    </div>
                    <div className="text-center p-2 bg-blue-900/20 rounded border border-blue-500/30">
                      <div className="text-xl text-blue-400 mb-1">60</div>
                      <div className="text-xs">Song Title</div>
                    </div>
                    <div className="text-center p-2 bg-purple-900/20 rounded border border-purple-500/30">
                      <div className="text-xl text-purple-400 mb-1">40</div>
                      <div className="text-xs">Artist Only</div>
                    </div>
                    <div className="text-center p-2 bg-orange-900/20 rounded border border-orange-500/30">
                      <div className="text-xl text-orange-400 mb-1">20</div>
                      <div className="text-xs">Close Match</div>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-500/30">
                  <h4 className="font-semibold text-lg mb-3 text-indigo-300 flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Getting Started
                  </h4>
                  <div className="grid grid-cols-1 gap-2 text-gray-300 text-xs">
                    <div>1. Click "Single Player" to start a game</div>
                    <div>2. Configure your game settings</div>
                    <div>3. Click "Start Game" to begin playing</div>
                    <div>4. Listen to the music and make your guess</div>
                    <div>5. Submit your guess and see your score!</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-purple-300/60">
          <p className="text-xs">Ready to test your music knowledge? Choose your game mode above!</p>
        </div>
      </div>
    </div>
  );
}
