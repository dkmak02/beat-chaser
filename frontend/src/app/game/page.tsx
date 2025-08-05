'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGameConfig } from '@/contexts/GameConfigContext';
import { 
  Play, 
  Pause, 
  SkipForward, 
  X, 
  Trophy, 
  Clock, 
  Music,
  Search
} from 'lucide-react';
import { Select, Input, Button, Progress, Card, Space, Typography } from 'antd';

const { Text, Title } = Typography;

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
      const data = await response.json();
      if (data.success && data.data) {
        setAvailableSongs(data.data);
      } else {
        throw new Error('Failed to fetch songs');
      }
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
    if (gameState.timeLeft > 0 && !gameState.showAnswer) {
      timerRef.current = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (gameState.timeLeft === 0 && !gameState.showAnswer) {
      handleSubmitGuess();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [gameState.timeLeft, gameState.showAnswer]);

  // Audio progress effect
  useEffect(() => {
    if (gameState.isPlaying && gameState.audioProgress < 100) {
      audioProgressRef.current = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          audioProgress: prev.audioProgress + 1
        }));
      }, 100);
    }

    return () => {
      if (audioProgressRef.current) {
        clearTimeout(audioProgressRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.audioProgress]);

  const calculateScore = (selectedSongId: number | null, actualSong: Song) => {
    if (!selectedSongId) return 0;
    
    const selectedSong = availableSongs.find(song => song.id === selectedSongId);
    if (!selectedSong) return 0;
    
    const songMatch = selectedSong.title.toLowerCase() === actualSong.title.toLowerCase();
    const artistMatch = selectedSong.artist.toLowerCase() === actualSong.artist.toLowerCase();
    
    if (songMatch && artistMatch) return 10;
    if (songMatch || artistMatch) return 5;
    return 0;
  };

  const handleSubmitGuess = () => {
    const roundScore = calculateScore(selectedSongId, currentSong);
    setGameState(prev => ({
      ...prev,
      score: prev.score + roundScore,
      showAnswer: true
    }));
  };

  const handleNextRound = () => {
    if (gameState.currentRound < gameState.totalRounds) {
      setGameState(prev => ({
        ...prev,
        currentRound: prev.currentRound + 1,
        timeLeft: gameConfig?.timeLimit || 30,
        showAnswer: false,
        audioProgress: 0
      }));
      setSelectedSongId(null);
    } else {
      // Game over
      router.push('/');
    }
  };

  const toggleAudio = () => {
    setGameState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const skipRound = () => {
    handleSubmitGuess();
  };

  const quitGame = () => {
    clearGameConfig();
    router.push('/');
  };

  const getTimeLeftColor = () => {
    if (gameState.timeLeft <= 5) return 'text-red-400';
    if (gameState.timeLeft <= 10) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getProgressColor = () => {
    if (gameState.audioProgress < 30) return 'bg-blue-500';
    if (gameState.audioProgress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Convert songs to Select options
  const songOptions = availableSongs.map(song => ({
    value: song.id,
    label: `${song.title} - ${song.artist} (${song.genre})`,
    song: song
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-16">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <button 
              onClick={quitGame}
              className="text-white hover:text-red-400 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Beat Chaser</h1>
              <p className="text-purple-200">Round {gameState.currentRound} of {gameState.totalRounds}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-bold">{gameState.score}</span>
              </div>
              <p className="text-purple-200 text-sm">Score</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-red-400" />
                <span className={`font-bold ${getTimeLeftColor()}`}>{gameState.timeLeft}s</span>
              </div>
              <p className="text-purple-200 text-sm">Time Left</p>
            </div>
          </div>
        </div>

        {/* Audio Player */}
        <Card className="bg-white/10 border-white/20 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <button
                onClick={toggleAudio}
                className="w-12 h-12 bg-purple-500 hover:bg-purple-600 rounded-full flex items-center justify-center text-white transition-colors"
              >
                {gameState.isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <div className="flex-1">
                <Progress 
                  percent={gameState.audioProgress} 
                  strokeColor="#8b5cf6"
                  showInfo={false}
                  className="custom-progress"
                />
              </div>
            </div>
            <Text className="text-purple-200">
              {gameState.isPlaying ? 'Playing...' : 'Click play to start listening'}
            </Text>
          </div>
        </Card>

        {/* Guess Form */}
        <Card className="bg-white/10 border-white/20">
          {!gameState.showAnswer ? (
            <div className="space-y-6">
              <div>
                <Title level={4} className="text-white text-center mb-4">Make Your Guess</Title>
              </div>
              
              {/* Song Selection */}
              <div>
                <Text className="text-white mb-2 block">Select Song</Text>
                {isLoadingSongs ? (
                  <div className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400 mx-auto mb-2"></div>
                    <Text className="text-purple-200 text-sm">Loading songs...</Text>
                  </div>
                ) : (
                  <Select
                    showSearch
                    placeholder="Search and select the correct song..."
                    value={selectedSongId}
                    onChange={setSelectedSongId}
                    className="w-full"
                    options={songOptions}
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    notFoundContent={
                      <div className="text-center py-4">
                        <Search className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                        <Text className="text-gray-400">No songs found</Text>
                      </div>
                    }
                    disabled={gameState.timeLeft === 0}
                  />
                )}
              </div>

              <Space className="w-full">
                <Button 
                  type="primary"
                  size="large"
                  onClick={handleSubmitGuess} 
                  disabled={gameState.timeLeft === 0}
                  className="flex-1"
                >
                  Submit Guess
                </Button>
                <Button 
                  onClick={skipRound}
                  disabled={gameState.timeLeft === 0}
                  icon={<SkipForward />}
                >
                  Skip
                </Button>
              </Space>
            </div>
          ) : (
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                calculateScore(selectedSongId, currentSong) > 0 ? 'bg-green-500' : 'bg-red-500'
              }`}>
                <span className="text-2xl text-white">
                  {calculateScore(selectedSongId, currentSong) > 0 ? '✓' : '✗'}
                </span>
              </div>

              <Title level={3} className="text-white mb-4">
                {calculateScore(selectedSongId, currentSong) > 0 ? 'Correct!' : 'Not quite...'}
              </Title>
              
              <Card className="bg-white/10 mb-4">
                <Text className="text-lg text-white mb-2 block">
                  <strong>{currentSong.title}</strong>
                </Text>
                <Text className="text-lg text-purple-200">
                  by <strong>{currentSong.artist}</strong>
                </Text>
                
                <div className="mt-4">
                  <Text className="text-white">
                    Your score: <strong>{calculateScore(selectedSongId, currentSong)}</strong> points
                  </Text>
                </div>
              </Card>

              <Button 
                type="primary"
                size="large"
                onClick={handleNextRound}
              >
                {gameState.currentRound < gameState.totalRounds ? 'Next Round' : 'Finish Game'}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
} 