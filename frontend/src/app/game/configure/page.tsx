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
  Divider
} from 'antd';
import { ArrowLeftOutlined, PlayCircleOutlined, ClockCircleOutlined, NumberOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';

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
  
  const [form] = Form.useForm();
  const [config, setConfig] = useState<GameConfig>({
    rounds: 5,
    roundDuration: 30,
    gameMode: gameMode
  });

  const {
    token: { colorBgContainer, borderRadiusLG, colorBgLayout },
  } = theme.useToken();

  const handleConfigChange = (field: keyof GameConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStartGame = () => {
    console.log('Starting game with config:', config);
    router.push(`/game/play?mode=${config.gameMode}&rounds=${config.rounds}&duration=${config.roundDuration}`);
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

        <Row gutter={24}>
          {/* Configuration Form */}
          <Col xs={24} lg={14}>
            <Card 
              title={
                <Space>
                  <NumberOutlined />
                  <span>Ustawienia gry</span>
                </Space>
              }
              style={{ marginBottom: 24 }}
            >
              <Form
                form={form}
                layout="vertical"
                initialValues={config}
                onValuesChange={(_, allValues) => {
                  setConfig(prev => ({ ...prev, ...allValues }));
                }}
              >
                <Form.Item
                  label="Liczba rund"
                  name="rounds"
                  rules={[{ required: true, message: 'Wybierz liczbę rund!' }]}
                >
                  <Select 
                    size="large"
                    placeholder="Wybierz liczbę rund"
                    onChange={(value) => handleConfigChange('rounds', value)}
                  >
                    <Option value={3}>3 rundy (Szybka gra)</Option>
                    <Option value={5}>5 rund (Standardowa)</Option>
                    <Option value={10}>10 rund (Długa gra)</Option>
                    <Option value={15}>15 rund (Maratón)</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Czas trwania rundy"
                  name="roundDuration"
                  rules={[{ required: true, message: 'Wybierz czas trwania rundy!' }]}
                >
                  <Select 
                    size="large"
                    placeholder="Wybierz czas trwania rundy"
                    onChange={(value) => handleConfigChange('roundDuration', value)}
                  >
                    <Option value={15}>15 sekund (Błyskawica)</Option>
                    <Option value={30}>30 sekund (Standardowy)</Option>
                    <Option value={45}>45 sekund (Spokojny)</Option>
                    <Option value={60}>60 sekund (Relaksacyjny)</Option>
                  </Select>
                </Form.Item>

                {gameMode === 'multiplayer' && (
                  <Form.Item
                    label="Maksymalna liczba graczy"
                    name="maxPlayers"
                    initialValue={4}
                  >
                    <InputNumber
                      min={2}
                      max={8}
                      size="large"
                      style={{ width: '100%' }}
                      placeholder="Maksymalna liczba graczy"
                    />
                  </Form.Item>
                )}
              </Form>
            </Card>

            {/* Action Buttons */}
            <div style={{ textAlign: 'center' }}>
              <Space size="large">
                <Button size="large" onClick={handleBack}>
                  Anuluj
                </Button>
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<PlayCircleOutlined />}
                  onClick={handleStartGame}
                  style={{ minWidth: '150px' }}
                >
                  Rozpocznij grę
                </Button>
              </Space>
            </div>
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
                  <Text style={{ fontSize: '20px', color: '#1677ff' }}>{config.rounds}</Text>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <Text strong>Czas na rundę:</Text>
                  <br />
                  <Text style={{ fontSize: '20px', color: '#1677ff' }}>{config.roundDuration} sekund</Text>
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
