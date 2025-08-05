'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Play, Settings, Clock, Hash, Music2, Target, LogIn } from 'lucide-react';
import { useGameConfig } from '@/contexts/GameConfigContext';
import { useUser } from '@/contexts/UserContext';
import { Select, Slider, Button, Card, Typography, Space, Row, Col, Layout, Avatar, Tag } from 'antd';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

interface GameConfig {
  mode: 'single';
  rounds: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'pop' | 'rock' | 'classical' | 'mixed';
  timeLimit: number;
}

export default function SinglePlayerConfig() {
  const router = useRouter();
  const { setGameConfig } = useGameConfig();
  const { isLoggedIn, username } = useUser();
  const [config, setConfig] = useState<GameConfig>({
    mode: 'single',
    rounds: 10,
    difficulty: 'medium',
    category: 'mixed',
    timeLimit: 30
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
      gameMode: 'singleplayer'
    });
    router.push('/game');
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
      <Layout className="h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Content className="flex items-center justify-center p-6">
          <Card className="text-center max-w-md">
            <Space direction="vertical" size="large" className="w-full">
              <Avatar 
                icon={<LogIn />} 
                size={96} 
                className="bg-gradient-to-r from-purple-500 to-blue-500"
              />
              <div>
                <Title level={2} className="mb-4">Login Required</Title>
                <Paragraph className="text-lg mb-6">
                  You need to be logged in to start a game
                </Paragraph>
              </div>
              <Button 
                type="primary" 
                size="large" 
                onClick={() => router.push('/')}
              >
                Go to Login
              </Button>
            </Space>
          </Card>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-16">
      <Content className="p-6 overflow-auto h-full">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Button 
              icon={<ArrowLeft />}
              onClick={() => router.back()}
              className="mr-4"
            />
            <div>
              <Title level={2} className="text-white mb-1 flex items-center">
                <Settings className="w-6 h-6 mr-3 text-purple-300" />
                Single Player Configuration
              </Title>
              <Paragraph className="text-purple-200 mb-0">
                Customize your music guessing experience
              </Paragraph>
              <Tag color="purple" className="text-sm">
                Logged in as: {username}
              </Tag>
            </div>
          </div>

          <Row gutter={[24, 24]} className="flex-1 overflow-auto">
            {/* Settings Panel */}
            <Col xs={24} lg={16}>
              <Space direction="vertical" size="large" className="w-full">
                {/* Game Mode Card */}
                <Card title="Game Mode" className="bg-white/10 border-white/20">
                  <div className="text-center">
                    <Avatar 
                      icon={<Target />} 
                      size={48} 
                      className="bg-purple-500 mb-3"
                    />
                    <Title level={4} className="text-purple-200 mb-1">Single Player</Title>
                    <Text className="text-purple-300">Solo challenge</Text>
                  </div>
                </Card>

                {/* Difficulty & Category */}
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Card title="Difficulty Level" className="bg-white/10 border-white/20">
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
                    </Card>
                  </Col>

                  <Col xs={24} md={12}>
                    <Card title="Music Category" className="bg-white/10 border-white/20">
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
                    </Card>
                  </Col>
                </Row>

                {/* Game Settings */}
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Card title="Number of Rounds" className="bg-white/10 border-white/20">
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
                    </Card>
                  </Col>

                  <Col xs={24} md={12}>
                    <Card title="Time Limit" className="bg-white/10 border-white/20">
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
                    </Card>
                  </Col>
                </Row>
              </Space>
            </Col>

            {/* Preview Panel */}
            <Col xs={24} lg={8}>
              <Card 
                title={
                  <Space>
                    <Play className="w-5 h-5 text-green-300" />
                    Game Preview
                  </Space>
                }
                className="bg-white/10 border-white/20 h-fit"
              >
                <Space direction="vertical" size="middle" className="w-full">
                  <Card size="small" className="bg-white/10">
                    <Text strong className="text-purple-200">Mode</Text>
                    <div className="text-white">Single Player</div>
                  </Card>
                  <Card size="small" className="bg-white/10">
                    <Text strong className="text-purple-200">Difficulty</Text>
                    <div className="text-white capitalize">{config.difficulty}</div>
                  </Card>
                  <Card size="small" className="bg-white/10">
                    <Text strong className="text-purple-200">Category</Text>
                    <div className="text-white capitalize">{config.category}</div>
                  </Card>
                  <Card size="small" className="bg-white/10">
                    <Text strong className="text-purple-200">Rounds</Text>
                    <div className="text-white">{config.rounds}</div>
                  </Card>
                  <Card size="small" className="bg-white/10">
                    <Text strong className="text-purple-200">Time Limit</Text>
                    <div className="text-white">{config.timeLimit}s</div>
                  </Card>
                </Space>
                
                <Button
                  type="primary"
                  size="large"
                  icon={<Play />}
                  onClick={handleSubmit}
                  className="w-full mt-6"
                >
                  Start Game
                </Button>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
} 