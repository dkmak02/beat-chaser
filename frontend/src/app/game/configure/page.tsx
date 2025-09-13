'use client';

import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Form, 
  InputNumber, 
  Select, 
  Button, 
  Row, 
  Col, 
  Space,
  theme,
  Divider,
  message
} from 'antd';
import { ArrowLeftOutlined, PlayCircleOutlined, ClockCircleOutlined, NumberOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWebSocketContext } from '@/contexts/WebSocketContext';
import { WebSocketMessage } from '@/services/WebSocketService';
import { useCreateSingleplayerGame, useCreateMultiplayerGame, useJoinGame, useStartGame } from '@/hooks/useGame';
import { useAuth } from '@/contexts/AuthContext';

const { Title, Text } = Typography;
const { Option } = Select;

interface GameConfig {
  rounds: number;
  roundDuration: number;
  gameMode: 'singleplayer' | 'multiplayer';
}

export default function GameConfigurePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameMode = searchParams.get('mode') as 'singleplayer' | 'multiplayer' || 'singleplayer';
  
  // Auth context
  const { user } = useAuth();
  
  // WebSocket context
  const { 
    isConnected, 
    subscribeToGameEvents, 
    sendGameMessage,
    error: wsError 
  } = useWebSocketContext();
  
  // React Query mutations
  const createSingleplayerGame = useCreateSingleplayerGame();
  const createMultiplayerGame = useCreateMultiplayerGame();
  const joinGameMutation = useJoinGame();
  const startGameMutation = useStartGame();
  
  const [form] = Form.useForm();
  const [config, setConfig] = useState<GameConfig>({
    rounds: 5,
    roundDuration: 30,
    gameMode: gameMode
  });
  const [isStartingGame, setIsStartingGame] = useState(false);
  
  // Check if any mutation is loading
  const isMutationLoading = createSingleplayerGame.isPending || createMultiplayerGame.isPending || joinGameMutation.isPending || startGameMutation.isPending;

  // Ant Design theme
  const {
    token: { colorBgContainer, borderRadiusLG, colorBgLayout },
  } = theme.useToken();

  const handleConfigChange = (field: keyof GameConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStartGame = async () => {
    if (!isConnected) {
      message.error('Połączenie WebSocket nie jest aktywne. Spróbuj ponownie.');
      return;
    }

    if (!user?.id) {
      message.error('Nie jesteś zalogowany. Zaloguj się, aby rozpocząć grę.');
      return;
    }

    setIsStartingGame(true);
    
    try {
      
      const gameCreationPromise = config.gameMode === 'singleplayer' 
        ? createSingleplayerGame.mutateAsync({
            playerId: user.id,
            rounds: config.rounds
          })
        : createMultiplayerGame.mutateAsync({
            playerId: user.id,
            rounds: config.rounds,
            maxPlayers: 4
          });

      const gameResponse = await gameCreationPromise;
      const gameId = gameResponse.id;
      
      const unsubscribeFromGame = subscribeToGameEvents(gameId, (wsMessage: WebSocketMessage) => {
        console.log('🎮 Game event received:', wsMessage);
        
        switch (wsMessage.type) {
          case 'game-started':
            console.log('✅ Game started successfully:', wsMessage.payload);
            router.push(`/game/play?gameId=${gameId}&mode=${config.gameMode}&rounds=${config.rounds}&duration=${config.roundDuration}`);
            break;
            
          case 'game-ready':
            console.log('🎯 Game is ready:', wsMessage.payload);
            break;
            
          case 'player-joined':
            console.log('👤 Player joined:', wsMessage.payload);
            break;
            
          case 'game-error':
            console.error('❌ Game error:', wsMessage.payload);
            const errorMsg = (wsMessage.payload as any)?.message || 'Nieznany błąd';
            message.error(`Błąd gry: ${errorMsg}`);
            setIsStartingGame(false);
            break;
            
          default:
            console.log('📨 Unknown game event:', wsMessage.type, wsMessage.payload);
        }
      });
       const joinResponse = await joinGameMutation.mutateAsync({
        gameId: gameId,
        playerId: user.id
      });
      
      console.log('✅ Successfully joined game:', joinResponse);
      
      // Step 3: Start the game via REST API
      const startResponse = await startGameMutation.mutateAsync({
        gameId: gameId
      });
      
      console.log('✅ Game started via REST API:', startResponse);
      message.success(`Gra rozpoczęta! Gracze: ${startResponse.players.length}`);
      
      // Navigate to game play page
      router.push(`/game/play?gameId=${gameId}&mode=${config.gameMode}&rounds=${config.rounds}&duration=${config.roundDuration}`);
    } catch (error) {
      console.error('Failed to start game:', error);
      
      // Log detailed error information for 403 debugging
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
      
      if ((error as any)?.response) {
        const axiosError = error as any;
        console.error('HTTP Status:', axiosError.response.status);
        console.error('Response data:', axiosError.response.data);
        console.error('Response headers:', axiosError.response.headers);
        console.error('Request config:', axiosError.config);
        
        if (axiosError.response.status === 403) {
          message.error(`Brak dostępu (403): ${axiosError.response.data?.message || 'Nie masz uprawnień do tej operacji. Sprawdź czy jesteś zalogowany.'}`);
        } else if (axiosError.response.status === 401) {
          message.error('Sesja wygasła. Zaloguj się ponownie.');
        } else {
          message.error(`Błąd HTTP ${axiosError.response.status}: ${axiosError.response.data?.message || 'Nieznany błąd'}`);
        }
      } else {
        message.error('Nie udało się rozpocząć gry. Sprawdź połączenie internetowe.');
      }
      
      setIsStartingGame(false);
    }
  };

  const handleBack = () => {
    router.push('/');
  };

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
          maxWidth: '800px',
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
            Powrót do menu głównego
          </Button>


          <Title level={2} style={{ margin: 0 }}>
            Konfiguracja rozgrywki
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Tryb: <strong>{gameMode === 'singleplayer' ? 'Singleplayer' : 'Multiplayer'}</strong>
          </Text>
        </div>

        {/* Configuration Form */}
        <Row gutter={32}>
          <Col xs={24} lg={14}>
            <Card 
              title={
                <Space>
                  <NumberOutlined />
                  <span>Ustawienia gry</span>
                </Space>
              }
            >
              <Form
                form={form}
                layout="vertical"
                initialValues={config}
                onValuesChange={(_, allValues) => {
                  setConfig(prev => ({ ...prev, ...allValues }));
                }}
              >
                <Form.Item label="Liczba rund" name="rounds">
                  <Select 
                    size="large"
                    value={config.rounds}
                    onChange={(value) => handleConfigChange('rounds', value)}
                  >
                    <Option value={3}>3 rundy (Szybka gra)</Option>
                    <Option value={5}>5 rund (Standardowa)</Option>
                    <Option value={10}>10 rund (Długa gra)</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="Czas na rundę (sekundy)" name="roundDuration">
                  <InputNumber
                    size="large"
                    min={15}
                    max={60}
                    step={5}
                    value={config.roundDuration}
                    onChange={(value) => handleConfigChange('roundDuration', value || 30)}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Form>

              {/* Start Game Button */}
              <div style={{ marginTop: 32, textAlign: 'center' }}>
                <Space direction="vertical" size="large">
                  <Button 
                    type="primary" 
                    size="large" 
                    icon={<PlayCircleOutlined />}
                    onClick={handleStartGame}
                    loading={isStartingGame || isMutationLoading}
                    disabled={!isConnected || !user?.id}
                    style={{ minWidth: '150px' }}
                  >
                    {isStartingGame || isMutationLoading ? 'Tworzenie gry...' : 'Rozpocznij grę'}
                  </Button>
                </Space>
              </div>
            </Card>
          </Col>

          {/* Game Summary */}
          <Col xs={24} lg={10}>
            <Card 
              title={
                <Space>
                  <ClockCircleOutlined />
                  <span>Podsumowanie</span>
                </Space>
              }
            >
              <div style={{ padding: '16px 0' }}>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Tryb gry:</Text>
                  <br />
                  <Text style={{ fontSize: '16px' }}>
                    {gameMode === 'singleplayer' ? '🎯 Singleplayer' : '👥 Multiplayer'}
                  </Text>
                </div>

                <Divider />

                <div style={{ marginBottom: 16 }}>
                  <Text strong>Liczba rund:</Text>
                  <br />
                  <Text style={{ fontSize: '16px', color: '#1890ff' }}>
                    {config.rounds} {config.rounds === 1 ? 'runda' : config.rounds < 5 ? 'rundy' : 'rund'}
                  </Text>
                </div>

                <Divider />

                <div style={{ marginBottom: 16 }}>
                  <Text strong>Czas na rundę:</Text>
                  <br />
                  <Text style={{ fontSize: '16px', color: '#fa8c16' }}>
                    {config.roundDuration} sekund
                  </Text>
                </div>

                <Divider />

                <div style={{ marginBottom: 16 }}>
                  <Text strong>Szacowany czas gry:</Text>
                  <br />
                  <Text style={{ fontSize: '16px', color: '#52c41a' }}>
                    ~{Math.ceil((config.rounds * config.roundDuration) / 60)} minut
                  </Text>
                </div>

              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
