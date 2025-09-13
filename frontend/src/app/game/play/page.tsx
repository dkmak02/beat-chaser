'use client';

import React, { useEffect, useState } from 'react';
import { 
  Card, 
  Typography, 
  Progress,
  Alert,
  Select,
  Row,
  Col,
  Button,
  Slider
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAllSongs, Song } from '@/services/gameApi';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const { Title, Text } = Typography;
const { Option } = Select;

interface GameState {
  currentRound: number;
  totalRounds: number;
  roundDuration: number;
  timeLeft: number;
  isPlaying: boolean;
  isPaused: boolean;
  score: number;
}

interface GuessState {
  selectedSong: string;
  selectedArtist: string;
}

export default function GamePlayPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const gameMode = searchParams.get('mode') || 'singleplayer';
  const rounds = parseInt(searchParams.get('rounds') || '5');
  const duration = parseInt(searchParams.get('duration') || '30');

  // State for songs from API
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for current song and audio
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  // Remove old audio ref state since we're using react-h5-audio-player now
  // const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [audioVolume, setAudioVolume] = useState(0.1);
  const [audioStartTime, setAudioStartTime] = useState(0);
  const [audioFragmentDuration] = useState(30); // 30 seconds fragment
  const [playerRef, setPlayerRef] = useState<any>(null);
  
  // State for countdown and round management
  const [roundCountdown, setRoundCountdown] = useState<number | null>(null);
  const [isRoundActive, setIsRoundActive] = useState(false);
  const [autoplayFailed, setAutoplayFailed] = useState(false);

  const [gameState, setGameState] = useState<GameState>({
    currentRound: 1,
    totalRounds: rounds,
    roundDuration: duration,
    timeLeft: duration,
    isPlaying: true, // Automatycznie rozpoczęta gra
    isPaused: false,
    score: 0
  });

  const [guessState, setGuessState] = useState<GuessState>({
    selectedSong: '',
    selectedArtist: ''
  });

  const handleBack = () => {
    router.push('/game/configure?mode=' + gameMode);
  };

  // Function to convert backend path to web URL
  const getAudioUrl = (song: Song) => {
    // Convert backend system path to web-accessible URL
    const filename = song.audioPreviewUrl.split('\\').pop() || song.audioPreviewUrl.split('/').pop();
    return `/music/${filename}`;
  };

  // Function to select random song for current round
  const selectRandomSong = () => {
    if (songs.length > 0) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      const selectedSong = songs[randomIndex];
      setCurrentSong(selectedSong);
      
      // Generate random start time (avoid last 30 seconds of song)
      const maxStartTime = Math.max(0, selectedSong.durationSeconds - audioFragmentDuration);
      const randomStartTime = Math.floor(Math.random() * maxStartTime);
      setAudioStartTime(randomStartTime);
      
      console.log('🎵 Selected song for round:', selectedSong);
      console.log('🎵 Audio URL:', getAudioUrl(selectedSong));
      console.log('🎵 Fragment: ' + randomStartTime + 's - ' + (randomStartTime + audioFragmentDuration) + 's');
    }
  };

  // Function to start round countdown
  const startRoundCountdown = () => {
    setRoundCountdown(3);
    setIsRoundActive(false);
    setAutoplayFailed(false); // Reset autoplay state for new round
    // Stop any playing audio
    if (playerRef?.audio?.current && isAudioPlaying) {
      playerRef.audio.current.pause();
      setIsAudioPlaying(false);
    }
  };

  // Load songs from API
  useEffect(() => {
    const loadSongs = async () => {
      try {
        setLoading(true);
        setError(null);
        const songsData = await getAllSongs();
        setSongs(songsData);
        console.log('🎵 Loaded songs:', songsData);
      } catch (err) {
        console.error('❌ Error loading songs:', err);
        setError('Nie udało się wczytać piosenek');
      } finally {
        setLoading(false);
      }
    };

    loadSongs();
  }, []);

  // Select random song when songs are loaded or round changes
  useEffect(() => {
    if (songs.length > 0) {
      selectRandomSong();
      // Start countdown for new round
      startRoundCountdown();
    }
  }, [songs, gameState.currentRound]);

  // Round countdown effect
  useEffect(() => {
    let countdownTimer: NodeJS.Timeout;
    
    if (roundCountdown !== null && roundCountdown > 0) {
      countdownTimer = setTimeout(() => {
        setRoundCountdown(prev => prev! - 1);
      }, 1000);
    } else if (roundCountdown === 0) {
      // Countdown finished, start the round
      console.log('🎵 Countdown finished, starting round...');
      setRoundCountdown(null);
      setIsRoundActive(true);
      // Auto-start audio when round begins
      setTimeout(() => {
        console.log('🎵 Attempting to auto-start audio...');
        startAudioFragment();
      }, 500); // Small delay for smooth transition
    }
    
    return () => {
      if (countdownTimer) clearTimeout(countdownTimer);
    };
  }, [roundCountdown]);

  // Auto timer effect - only when round is active
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameState.isPlaying && gameState.timeLeft > 0 && isRoundActive) {
      timer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (gameState.timeLeft === 0) {
      // Auto skip to next round when time is up
      handleNextRound();
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState.isPlaying, gameState.timeLeft, isRoundActive]);

  // Set audio volume when playerRef changes
  useEffect(() => {
    if (playerRef?.audio?.current) {
      playerRef.audio.current.volume = audioVolume;
    }
  }, [playerRef, audioVolume]);

  // Monitor audio time and stop after fragment duration
  useEffect(() => {
    let audioTimeChecker: NodeJS.Timeout;
    
    if (playerRef?.audio?.current && isAudioPlaying) {
      audioTimeChecker = setInterval(() => {
        const currentTime = playerRef.audio.current!.currentTime;
        const endTime = audioStartTime + audioFragmentDuration;
        
        if (currentTime >= endTime) {
          playerRef.audio.current!.pause();
          setIsAudioPlaying(false);
          console.log('🎵 Audio fragment ended at:', currentTime + 's');
        }
      }, 100); // Check every 100ms for precision
    }
    
    return () => {
      if (audioTimeChecker) clearInterval(audioTimeChecker);
    };
  }, [playerRef, isAudioPlaying, audioStartTime, audioFragmentDuration]);

  // Audio control functions
  const startAudioFragment = () => {
    if (!playerRef?.audio?.current || !currentSong) {
      console.warn('🎵 Cannot start audio: missing playerRef or currentSong');
      return;
    }
    
    console.log('🎵 Setting audio time to:', audioStartTime);
    const audioElement = playerRef.audio.current;
    audioElement.currentTime = audioStartTime;
    
    const playPromise = audioElement.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        setIsAudioPlaying(true);
        setAutoplayFailed(false);
        console.log('🎵 Successfully started audio fragment at:', audioStartTime + 's');
      }).catch((err: Error) => {
        console.error('❌ Autoplay failed (browser policy):', err);
        console.log('🎵 User will need to manually start audio');
        setAutoplayFailed(true);
        // Don't set playing state if autoplay failed
      });
    }
  };

  const handlePlayPause = () => {
    if (!currentSong || !playerRef?.audio?.current) return;

    if (isAudioPlaying) {
      playerRef.audio.current.pause();
      setIsAudioPlaying(false);
    } else {
      startAudioFragment();
    }
  };

  const handleRestartAudio = () => {
    if (!playerRef?.audio?.current) return;
    playerRef.audio.current.currentTime = audioStartTime;
    if (isAudioPlaying) {
      playerRef.audio.current.play();
    }
  };

  const handleVolumeChange = (value: number) => {
    setAudioVolume(value);
    if (playerRef?.audio?.current) {
      playerRef.audio.current.volume = value;
    }
  };

  const handleAudioEnded = () => {
    setIsAudioPlaying(false);
    console.log('🎵 Audio naturally ended');
  };

  const handleAudioError = () => {
    console.error('❌ Audio loading error for:', currentSong?.audioPreviewUrl);
    setIsAudioPlaying(false);
  };

  const handleAudioLoadedData = () => {
    if (playerRef?.audio?.current) {
      console.log('🎵 Audio loaded, duration:', playerRef.audio.current.duration + 's');
    }
  };

  const handleNextRound = () => {
    // Stop audio when changing rounds
    if (playerRef?.audio?.current && isAudioPlaying) {
      playerRef.audio.current.pause();
      setIsAudioPlaying(false);
    }

    if (gameState.currentRound < gameState.totalRounds) {
      // Go to next round
      setGameState(prev => ({
        ...prev,
        currentRound: prev.currentRound + 1,
        timeLeft: prev.roundDuration
      }));
      // Reset guess selections
      setGuessState({
        selectedSong: '',
        selectedArtist: ''
      });
    } else {
      // Game finished
      console.log('Game finished! Final score:', gameState.score);
      // TODO: Navigate to results page or show final score
      router.push('/game/results?score=' + gameState.score);
    }
  };

  const handleSubmitGuess = () => {
    if (!guessState.selectedSong || !guessState.selectedArtist) {
      return;
    }
    
    console.log('Submitting guess:', {
      song: guessState.selectedSong,
      artist: guessState.selectedArtist,
      round: gameState.currentRound,
      timeLeft: gameState.timeLeft
    });
    
    // TODO: Send guess to backend API and get score
    // For now, just add some points based on time left
    const pointsEarned = Math.max(0, gameState.timeLeft * 10);
    setGameState(prev => ({
      ...prev,
      score: prev.score + pointsEarned
    }));
    
    // Automatically go to next round
    handleNextRound();
  };

  const handleSkipRound = () => {
    console.log('Skipping round:', gameState.currentRound);
    handleNextRound();
  };

  const handleStartPause = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying,
      isPaused: prev.isPlaying
    }));
  };

  const isGuessComplete = guessState.selectedSong && guessState.selectedArtist;

  const progressPercent = ((gameState.roundDuration - gameState.timeLeft) / gameState.roundDuration) * 100;

  return (
    <div style={{ 
      padding: '24px 48px', 
      height: '100%',
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center',
      overflow: 'auto',
      background: '#f5f5f5'
    }}>
      <div
        style={{
          background: '#ffffff',
          padding: 48,
          borderRadius: 8,
          maxWidth: '900px',
          margin: '0 auto',
          width: '100%'
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
            style={{ marginBottom: 16 }}
          >
            Powrót do konfiguracji
          </Button>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={2} style={{ margin: 0 }}>
                Beat Chaser - {gameMode === 'singleplayer' ? 'Singleplayer' : 'Multiplayer'}
              </Title>
              <Text type="secondary" style={{ fontSize: '16px' }}>
                Runda {gameState.currentRound} z {gameState.totalRounds}
              </Text>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1677ff' }}>
                Wynik: {gameState.score}
              </div>
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <Card style={{ marginBottom: 24, textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: '18px', color: '#666' }}>
              Ładowanie piosenek...
            </div>
          </Card>
        )}

        {error && (
          <Alert
            message="Błąd"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        {/* Game Area - only show when songs are loaded */}
        {!loading && !error && songs.length > 0 && (
        <Card style={{ marginBottom: 24 }}>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            {/* Timer */}
            <div style={{ marginBottom: 32 }}>
              <Title level={1} style={{ fontSize: '48px', margin: 0, color: gameState.timeLeft <= 5 ? '#ff4d4f' : '#1677ff' }}>
                {gameState.timeLeft}s
              </Title>
              <Progress 
                percent={progressPercent} 
                showInfo={false}
                strokeColor={gameState.timeLeft <= 5 ? '#ff4d4f' : '#1677ff'}
                style={{ maxWidth: '400px', margin: '16px auto' }}
              />
            </div>

            {/* Round Countdown */}
            {roundCountdown !== null && (
              <div style={{ 
                marginBottom: 32,
                padding: '40px',
                backgroundColor: '#f5f5f5',
                borderRadius: '12px',
                border: '3px solid #1677ff'
              }}>
                <Title level={1} style={{ 
                  fontSize: '72px', 
                  margin: 0, 
                  color: '#1677ff',
                  textShadow: '0 0 20px rgba(22, 119, 255, 0.5)'
                }}>
                  {roundCountdown}
                </Title>
                <div style={{ fontSize: '18px', color: '#666', marginTop: 16 }}>
                  Przygotuj się na rundę {gameState.currentRound}!
                </div>
              </div>
            )}

            {/* Audio Player */}
            {currentSong && isRoundActive && (
              <div style={{ 
                marginBottom: 32,
                padding: '24px',
                backgroundColor: '#f0f0f0',
                borderRadius: '12px',
                border: '2px solid #d9d9d9'
              }}>
                <Title level={4} style={{ marginBottom: 16, textAlign: 'center' }}>🎧 Odtwarzacz</Title>
                
                {/* React H5 Audio Player */}
                <div style={{ marginBottom: 16 }} className="no-seek-audio-player">
                  <AudioPlayer
                    ref={(ref) => setPlayerRef(ref)}
                    src={getAudioUrl(currentSong)}
                    autoPlay={true}
                    autoPlayAfterSrcChange={true}
                    volume={audioVolume}
                    onPlay={() => {
                      setIsAudioPlaying(true);
                    }}
                    onPause={() => setIsAudioPlaying(false)}
                    onEnded={handleAudioEnded}
                    onError={handleAudioError}
                    onLoadedData={() => {
                      handleAudioLoadedData();
                      // Set initial time when audio loads and start playing
                      if (playerRef?.audio?.current) {
                        setTimeout(() => {
                          startAudioFragment();
                        }, 100); // Small delay to ensure audio is ready
                      }
                    }}
                    onListen={() => {
                      // Monitor time during playback
                      if (playerRef?.audio?.current) {
                        const currentTime = playerRef.audio.current.currentTime;
                        const endTime = audioStartTime + audioFragmentDuration;
                        if (currentTime >= endTime) {
                          playerRef.audio.current.pause();
                          setIsAudioPlaying(false);
                        }
                      }
                    }}
                    showJumpControls={false}
                    showDownloadProgress={false}
                    showSkipControls={false}
                    layout="horizontal-reverse"
                    showFilledProgress={false}
                    hasDefaultKeyBindings={false}
                    customAdditionalControls={[]}
                    defaultCurrentTime="--:--"
                    defaultDuration="--:--"

                  />
                </div>

                {/* Audio Progress Info */}
                <div style={{ 
                  fontSize: '12px', 
                  color: '#666', 
                  textAlign: 'center',
                  marginBottom: 8
                }}>
                  Fragment: {audioFragmentDuration}s z utworu
                </div>
                
                <div style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
                  Posłuchaj {audioFragmentDuration}-sekundowego fragmentu i zgadnij tytuł oraz wykonawcę
                </div>
                
                {/* Debug info - remove in production */}
                {process.env.NODE_ENV === 'development' && (
                  <div style={{ 
                    marginTop: 8, 
                    fontSize: '10px', 
                    color: '#999', 
                    textAlign: 'center',
                    fontFamily: 'monospace'
                  }}>
                    DEBUG: {currentSong.title} - {currentSong.artist}<br/>
                    Fragment: {audioStartTime}s - {audioStartTime + audioFragmentDuration}s
                  </div>
                )}
              </div>
            )}

            {/* Game Content Placeholder */}
            <div style={{ 
              minHeight: '200px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              marginBottom: 32
            }}>
              <div style={{ textAlign: 'center', width: '100%' }}>
                <Title level={3} style={{ marginBottom: 24 }}>🎵 Zgadnij wykonawcę i tytuł utworu! 🎵</Title>
                
                {/* Guess Form */}
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <Row gutter={16} style={{ marginBottom: 24 }}>
                    <Col span={12}>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong>Tytuł piosenki:</Text>
                      </div>
                      <Select
                        showSearch
                        placeholder="Wybierz tytuł piosenki..."
                        size="large"
                        style={{ width: '100%' }}
                        value={guessState.selectedSong || undefined}
                        onChange={(value) => setGuessState(prev => ({ ...prev, selectedSong: value }))}
                        filterOption={(input, option) =>
                          (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                        }
                      >
                        {songs.map(song => (
                          <Option key={song.id} value={song.title}>
                            {song.title}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                    
                    <Col span={12}>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong>Wykonawca:</Text>
                      </div>
                      <Select
                        showSearch
                        placeholder="Wybierz wykonawcę..."
                        size="large"
                        style={{ width: '100%' }}
                        value={guessState.selectedArtist || undefined}
                        onChange={(value) => setGuessState(prev => ({ ...prev, selectedArtist: value }))}
                        filterOption={(input, option) =>
                          (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                        }
                      >
                        {[...new Set(songs.map(song => song.artist))].map(artist => (
                          <Option key={artist} value={artist}>
                            {artist}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                  </Row>
                  
                  {/* Action Buttons - only show when round is active */}
                  {isRoundActive && (
                    <Row gutter={16} style={{ marginTop: 24 }}>
                      <Col span={12}>
                        <Button
                          type="primary"
                          size="large"
                          block
                          disabled={!isGuessComplete}
                          onClick={handleSubmitGuess}
                          style={{ 
                            height: '50px',
                            fontSize: '16px',
                            fontWeight: 'bold'
                          }}
                        >
                          🎯 Sprawdź odpowiedź
                        </Button>
                      </Col>
                      <Col span={12}>
                        <Button
                          size="large"
                          block
                          onClick={handleSkipRound}
                          style={{ 
                            height: '50px',
                            fontSize: '16px'
                          }}
                        >
                          ⏭️ Pomiń rundę
                        </Button>
                      </Col>
                    </Row>
                  )}
                </div>
              </div>
            </div>

            {/* Selection Status */}
            <div style={{ marginTop: 16, fontSize: '14px', color: '#666' }}>
              {guessState.selectedSong ? (
                <span>✓ Tytuł: <strong>{guessState.selectedSong}</strong></span>
              ) : (
                <span>○ Wybierz tytuł piosenki</span>
              )}
              {' | '}
              {guessState.selectedArtist ? (
                <span>✓ Wykonawca: <strong>{guessState.selectedArtist}</strong></span>
              ) : (
                <span>○ Wybierz wykonawcę</span>
              )}
            </div>
          </div>
        </Card>
        )}
      </div>
    </div>
  );
}
