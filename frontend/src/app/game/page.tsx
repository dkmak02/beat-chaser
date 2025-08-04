'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Pause, SkipForward, X, Music, Volume2, Zap, Timer, Trophy, Target, RefreshCw } from 'lucide-react';
import { useGameConfig } from '@/contexts/GameConfigContext';

interface Song {
  id: number;
  title: string;
  artist: string;
  audioUrl: string;
  genre: string;
}

interface GameState {
  currentRound: number;
  totalRounds: number;
  score: number;
  timeLeft: number;
  isPlaying: boolean;
  showAnswer: boolean;
  audioProgress: number;
}

export default function GamePage() {
  const router = useRouter();
  const { gameConfig, clearGameConfig } = useGameConfig();
  
  // Redirect if no config is set
  useEffect(() => {
    if (!gameConfig) {
      router.push('/');
      return;
    }
  }, [gameConfig, router]);

  const [gameState, setGameState] = useState<GameState>({
    currentRound: 1,
    totalRounds: gameConfig?.rounds || 10,
    score: 0,
    timeLeft: gameConfig?.timeLimit || 30,
    isPlaying: false,
    showAnswer: false,
    audioProgress: 0
  });
  const [currentSong, setCurrentSong] = useState<Song>({
    id: 1,
    title: "Bohemian Rhapsody",
    artist: "Queen",
    audioUrl: "/music/queen.mp3",
    genre: "Rock"
  });
  const [availableSongs, setAvailableSongs] = useState<Song[]>([]);
  const [selectedSongId, setSelectedSongId] = useState<number | null>(null);
  const [songGuess, setSongGuess] = useState('');
  const [artistGuess, setArtistGuess] = useState('');
  const [isLoadingSongs, setIsLoadingSongs] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioProgressRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch songs from API
  const fetchSongs = async () => {
    setIsLoadingSongs(true);
    try {
      const response = await fetch('/api/song');
      if (!response.ok) {
        throw new Error('Failed to fetch songs');
      }
      const songs = await response.json();
      setAvailableSongs(songs);
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setIsLoadingSongs(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameState.isPlaying && gameState.timeLeft > 0 && !gameState.showAnswer) {
      timerRef.current = setTimeout(() => {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (gameState.timeLeft === 0 && !gameState.showAnswer) {
      handleSubmitGuess();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [gameState.timeLeft, gameState.showAnswer, gameState.isPlaying]);

  // Audio progress effect
  useEffect(() => {
    if (gameState.isPlaying && !gameState.showAnswer) {
      audioProgressRef.current = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          audioProgress: prev.audioProgress + (100 / (gameConfig?.timeLimit || 30)) // Use config time limit
        }));
      }, 1000);
    }
    return () => {
      if (audioProgressRef.current) clearInterval(audioProgressRef.current);
    };
  }, [gameState.isPlaying, gameState.showAnswer, gameConfig?.timeLimit]);



  const calculateScore = (songGuess: string, artistGuess: string, actualSong: Song) => {
    const songMatch = songGuess.toLowerCase().includes(actualSong.title.toLowerCase()) ||
                     actualSong.title.toLowerCase().includes(songGuess.toLowerCase());
    const artistMatch = artistGuess.toLowerCase().includes(actualSong.artist.toLowerCase()) ||
                       actualSong.artist.toLowerCase().includes(artistGuess.toLowerCase());

    if (songMatch && artistMatch) return 100;
    if (songMatch) return 60;
    if (artistMatch) return 40;
    return 0;
  };

  const handleSubmitGuess = () => {
    const roundScore = calculateScore(songGuess, artistGuess, currentSong);
    const isCorrect = roundScore > 0;
    
    setGameState(prev => ({
      ...prev,
      score: prev.score + roundScore,
      showAnswer: true,
      isPlaying: false
    }));
  };

  const handleNextRound = () => {
    if (gameState.currentRound >= gameState.totalRounds) {
      // Game complete - navigate to results
      router.push('/game/results');
    } else {
      // Load next round
      const nextSong = availableSongs[Math.floor(Math.random() * availableSongs.length)] || currentSong;
      setCurrentSong(nextSong);
      setGameState(prev => ({
        ...prev,
        currentRound: prev.currentRound + 1,
        timeLeft: gameConfig?.timeLimit || 30,
        showAnswer: false,
        audioProgress: 0
      }));
      setSelectedSongId(null);
      setSongGuess('');
      setArtistGuess('');
    }
  };

  const toggleAudio = () => {
    setGameState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const skipRound = () => {
    setGameState(prev => ({
      ...prev,
      score: Math.max(0, prev.score - 10), // Penalty for skipping
      showAnswer: true,
      isPlaying: false
    }));
  };

  const quitGame = () => {
    if (confirm('Are you sure you want to quit? Your progress will be lost.')) {
      clearGameConfig();
      router.push('/');
    }
  };

  const getTimeLeftColor = () => {
    if (gameState.timeLeft <= 5) return 'text-red-400';
    if (gameState.timeLeft <= 10) return 'text-orange-400';
    return 'text-white';
  };

  const getProgressColor = () => {
    const timeLimit = gameConfig?.timeLimit || 30;
    const percentage = (gameState.timeLeft / timeLimit) * 100;
    if (percentage <= 20) return 'bg-red-500';
    if (percentage <= 50) return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <div className="h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 md:p-6 overflow-hidden">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-2xl text-white mb-1">Round {gameState.currentRound} of {gameState.totalRounds}</h1>
              <p className="text-purple-200 flex items-center gap-2 text-sm">
                <Trophy className="w-4 h-4" />
                Score: {gameState.score} points
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4 text-sm text-purple-200">
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                {gameConfig?.difficulty || 'Medium'}
              </div>
              <div className="flex items-center gap-1">
                <Music className="w-4 h-4" />
                {gameConfig?.category || 'Mixed'}
              </div>
            </div>
          </div>
          <button 
            onClick={quitGame}
            className="text-white border border-red-400 hover:bg-red-500/20 px-3 py-2 rounded-lg transition-all duration-300 flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Quit
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white flex items-center gap-2 text-sm">
              <Timer className="w-4 h-4" />
              Time Remaining
            </span>
            <span className={`text-xl font-mono ${getTimeLeftColor()}`}>
              {gameState.timeLeft}s
            </span>
          </div>
          <div className="relative">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-1000 ${getProgressColor()}`}
                style={{ width: `${(gameState.timeLeft / (gameConfig?.timeLimit || 30)) * 100}%` }} 
              />
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
          {/* Audio Player */}
          <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="text-center">
              <div className="relative mb-6">
                <div className={`w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mx-auto flex items-center justify-center transition-all duration-300 ${gameState.isPlaying ? 'animate-pulse scale-110' : ''}`}>
                  <Music className="w-12 h-12 text-white" />
                </div>
                {gameState.isPlaying && (
                  <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-purple-400/50 mx-auto animate-ping" />
                )}
              </div>
              
              <h3 className="text-lg text-white mb-2">Now Playing</h3>
              <p className="text-purple-200 mb-4 text-sm">
                {currentSong.title} - {currentSong.artist}
              </p>
              
              {/* Audio Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-purple-300 mb-2">
                  <span>0:00</span>
                  <span>0:{(gameConfig?.timeLimit || 30).toString().padStart(2, '0')}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-400 to-blue-400 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${gameState.audioProgress}%` }}
                  />
                </div>
              </div>

              {/* Audio Controls */}
              <div className="flex justify-center gap-4">
                <button 
                  onClick={toggleAudio}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-14 h-14 rounded-full transition-all duration-300 hover:scale-110 flex items-center justify-center"
                >
                  {gameState.isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}
                </button>
                <button 
                  className="w-14 h-14 rounded-full border border-white/30 hover:bg-white/10 flex items-center justify-center transition-all duration-300"
                >
                  <Volume2 className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Audio Player Component */}
              <audio 
                src={currentSong.audioUrl} 
                preload="metadata"
                onError={(e) => console.error('Audio Error:', e)}
              />
            </div>
          </div>

          {/* Guess Form */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            {!gameState.showAnswer ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg text-white mb-4 text-center">Make Your Guess</h3>
                </div>
                
                {/* Song Selection */}
                <div>
                  <label className="text-sm text-white mb-2 block">Select Song</label>
                  {isLoadingSongs ? (
                    <div className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400 mx-auto mb-2"></div>
                      <p className="text-purple-200 text-sm">Loading songs...</p>
                    </div>
                  ) : (
                    <select 
                      value={selectedSongId || ''} 
                      onChange={(e) => setSelectedSongId(parseInt(e.target.value))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white text-sm focus:border-purple-400 transition-all duration-300"
                    >
                      <option value="">Choose the correct song...</option>
                      {availableSongs.map((song) => (
                        <option key={song.id} value={song.id} className="bg-gray-800">
                          {song.title} - {song.artist} ({song.genre})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Manual Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-white mb-2 block">Song Title</label>
                    <input
                      type="text"
                      value={songGuess}
                      onChange={(e) => setSongGuess(e.target.value)}
                      placeholder="Enter song title..."
                      className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white text-sm focus:border-purple-400 transition-all duration-300"
                      disabled={gameState.timeLeft === 0}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-white mb-2 block">Artist</label>
                    <input
                      type="text"
                      value={artistGuess}
                      onChange={(e) => setArtistGuess(e.target.value)}
                      placeholder="Enter artist name..."
                      className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white text-sm focus:border-purple-400 transition-all duration-300"
                      disabled={gameState.timeLeft === 0}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={handleSubmitGuess} 
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 text-sm"
                    disabled={gameState.timeLeft === 0}
                  >
                    Submit Guess
                  </button>
                  <button 
                    onClick={skipRound}
                    className="bg-white/10 border border-white/30 hover:bg-white/20 text-white py-3 px-4 rounded-lg transition-all duration-300 text-sm"
                    disabled={gameState.timeLeft === 0}
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  calculateScore(songGuess, artistGuess, currentSong) > 0 ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  <span className="text-2xl text-white">
                    {calculateScore(songGuess, artistGuess, currentSong) > 0 ? '✓' : '✗'}
                  </span>
                </div>

                <h3 className="text-xl text-white mb-4">
                  {calculateScore(songGuess, artistGuess, currentSong) > 0 ? 'Correct!' : 'Not quite...'}
                </h3>
                
                <div className="bg-white/10 rounded-lg p-4 mb-4">
                  <p className="text-lg text-white mb-2">
                    <strong>{currentSong.title}</strong>
                  </p>
                  <p className="text-lg text-purple-200 mb-3">
                    by <strong>{currentSong.artist}</strong>
                  </p>
                  
                  <div className="border-t border-white/20 pt-3">
                    <p className="text-sm text-purple-200 mb-2">Your guess:</p>
                    <p className="text-white text-sm">
                      {songGuess || '(no song guess)'} - {artistGuess || '(no artist guess)'}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-2xl text-yellow-400 mb-1">
                    +{calculateScore(songGuess, artistGuess, currentSong)} points
                  </div>
                  <div className="text-purple-200 text-sm">
                    Total Score: {gameState.score}
                  </div>
                </div>

                <button 
                  onClick={handleNextRound} 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 text-sm"
                >
                  {gameState.currentRound >= gameState.totalRounds ? 'View Results' : 'Next Round'}
                  <SkipForward className="w-4 h-4 ml-2 inline" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 