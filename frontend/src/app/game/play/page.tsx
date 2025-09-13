'use client';

import React, { useEffect, useState } from 'react';
import { 
  Card, 
  Typography, 
  Button, 
  Progress,
  Space,
  theme,
  Alert
} from 'antd';
import { ArrowLeftOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';

const { Title, Text } = Typography;

interface GameState {
  currentRound: number;
  totalRounds: number;
  roundDuration: number;
  timeLeft: number;
  isPlaying: boolean;
  isPaused: boolean;
  score: number;
}

export default function GamePlayPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const gameMode = searchParams.get('mode') || 'singleplayer';
  const rounds = parseInt(searchParams.get('rounds') || '5');
  const duration = parseInt(searchParams.get('duration') || '30');

  const [gameState, setGameState] = useState<GameState>({
    currentRound: 1,
    totalRounds: rounds,
    roundDuration: duration,
    timeLeft: duration,
    isPlaying: false,
    isPaused: false,
    score: 0
  });

  const {
    token: { colorBgContainer, borderRadiusLG, colorBgLayout },
  } = theme.useToken();

  const handleBack = () => {
    router.push('/game/configure?mode=' + gameMode);
  };

  const handleStartPause = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying,
      isPaused: prev.isPlaying
    }));
  };

  const progressPercent = ((gameState.roundDuration - gameState.timeLeft) / gameState.roundDuration) * 100;

  return (
    <div style={{ 
      padding: '24px 48px', 
      height: '100%',
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center',
      overflow: 'auto',
      background: colorBgLayout
    }}>
      <div
        style={{
          background: colorBgContainer,
          padding: 48,
          borderRadius: borderRadiusLG,
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

        {/* Game Area */}
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
              {!gameState.isPlaying ? (
                <div style={{ textAlign: 'center' }}>
                  <PlayCircleOutlined style={{ fontSize: '64px', color: '#1677ff', marginBottom: 16 }} />
                  <div>
                    <Title level={3}>Naciśnij START, aby rozpocząć rundę</Title>
                    <Text type="secondary">
                      Czas na rundę: {gameState.roundDuration} sekund
                    </Text>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <Title level={3}>🎵 Tutaj będzie odtwarzana muzyka 🎵</Title>
                  <Text type="secondary">
                    Zgadnij wykonawcę i tytuł utworu!
                  </Text>
                </div>
              )}
            </div>

            {/* Control Buttons */}
            <Space size="large">
              <Button 
                type="primary" 
                size="large"
                icon={gameState.isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                onClick={handleStartPause}
              >
                {gameState.isPlaying ? 'Pauza' : 'Start'}
              </Button>
              
              {gameState.isPlaying && (
                <Button size="large">
                  Poddaj się
                </Button>
              )}
            </Space>
          </div>
        </Card>
      </div>
    </div>
  );
}
