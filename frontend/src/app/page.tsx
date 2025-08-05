'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Music, Users, User, HelpCircle, Star, Headphones, Award, LogIn } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Button, Card, Avatar, Typography, Space, Row, Col, Modal, Layout, Tag } from 'antd';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

export default function Home() {
  const router = useRouter();
  const { isLoggedIn, username } = useUser();
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
    if (!isLoggedIn) {
      return;
    }
    router.push(`/config/${mode}`);
  };

  // Show playing state
  if (gameState === 'playing') {
    return (
      <Layout className="h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-16">
        <Content className="p-4 overflow-hidden">
          <div className="max-w-6xl mx-auto h-full">
            <div className="text-center mb-4">
              <Title level={2} className="text-white mb-1">🎵 Beat Chaser</Title>
              <Text className="text-gray-300 text-base">Test your music knowledge!</Text>
            </div>
          </div>
        </Content>
      </Layout>
    );
  }

  // Show main menu
  return (
    <Layout className="h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-16">
      <Content className="flex flex-col items-center justify-center p-6 h-full overflow-auto">
        {/* Hero Section */}
        <div className="text-center mb-8 max-w-3xl">
          <Space direction="vertical" size="large" align="center">
            <div className="flex items-center justify-center">
              <Avatar 
                icon={<Music />} 
                size={64} 
                className="bg-purple-500 mr-4"
              />
              <div>
                <Title level={1} className="text-white mb-0">
                  Beat Chaser
                </Title>
                <div className="flex items-center justify-center gap-1">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-300" />
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse delay-600" />
                </div>
              </div>
            </div>
            <div>
              <Title level={3} className="text-purple-200 mb-2">Test your music knowledge!</Title>
              <Paragraph className="text-purple-300 text-lg">
                Guess songs, compete with friends, and discover new music
              </Paragraph>
            </div>
            
            {/* Show login status */}
            {isLoggedIn && (
              <Tag color="purple" className="text-sm">
                <User className="w-4 h-4 mr-1" />
                Welcome back, {username}!
              </Tag>
            )}
          </Space>
        </div>

        {/* Game Mode Cards */}
        <Row gutter={[24, 24]} className="max-w-4xl w-full mb-8">
          <Col xs={24} md={12}>
            <Card
              hoverable
              className={`relative transition-all duration-300 ${
                hoveredCard === 'singleplayer' ? 'scale-105' : 'hover:scale-105'
              }`}
              onMouseEnter={() => setHoveredCard('singleplayer')}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleStartGame('singleplayer')}
              bodyStyle={{ padding: '32px', textAlign: 'center' }}
            >
              <Space direction="vertical" size="large" className="w-full">
                <Avatar 
                  icon={<User />} 
                  size={64} 
                  className="bg-gradient-to-r from-purple-500 to-blue-500"
                />
                <div>
                  <Title level={3} className="mb-2">Single Player</Title>
                  <Paragraph className="text-gray-600 mb-4">
                    Challenge yourself with solo music guessing
                  </Paragraph>
                  <Space direction="vertical" size="small" className="text-sm text-gray-500">
                    <Text>• Practice at your own pace</Text>
                    <Text>• Track your progress</Text>
                    <Text>• Multiple difficulty levels</Text>
                  </Space>
                </div>
              </Space>
              {!isLoggedIn && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Space direction="vertical" align="center">
                    <LogIn className="w-8 h-8 text-white" />
                    <Text className="text-white">Login required</Text>
                  </Space>
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              hoverable
              className={`relative transition-all duration-300 ${
                hoveredCard === 'multiplayer' ? 'scale-105' : 'hover:scale-105'
              }`}
              onMouseEnter={() => setHoveredCard('multiplayer')}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleStartGame('multiplayer')}
              bodyStyle={{ padding: '32px', textAlign: 'center' }}
            >
              <Space direction="vertical" size="large" className="w-full">
                <Avatar 
                  icon={<Users />} 
                  size={64} 
                  className="bg-gradient-to-r from-blue-500 to-purple-500"
                />
                <div>
                  <Title level={3} className="mb-2">Multiplayer</Title>
                  <Paragraph className="text-gray-600 mb-4">
                    Compete with friends in real-time battles
                  </Paragraph>
                  <Space direction="vertical" size="small" className="text-sm text-gray-500">
                    <Text>• Real-time competition</Text>
                    <Text>• Leaderboards</Text>
                    <Text>• Team up or go solo</Text>
                  </Space>
                </div>
              </Space>
              {!isLoggedIn && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Space direction="vertical" align="center">
                    <LogIn className="w-8 h-8 text-white" />
                    <Text className="text-white">Login required</Text>
                  </Space>
                </div>
              )}
            </Card>
          </Col>
        </Row>

        {/* Login Prompt */}
        {!isLoggedIn && (
          <Card className="max-w-md mx-auto text-center">
            <Space direction="vertical" size="large" className="w-full">
              <Avatar 
                icon={<LogIn />} 
                size={48} 
                className="bg-gradient-to-r from-purple-500 to-blue-500"
              />
              <div>
                <Title level={4} className="mb-2">Login to Start Playing</Title>
                <Paragraph className="text-gray-600 mb-4">
                  Create an account or sign in to access all game modes
                </Paragraph>
              </div>
              <Space>
                <Button type="primary" size="large">
                  Login
                </Button>
                <Button type="primary" size="large">
                  Sign Up
                </Button>
              </Space>
            </Space>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-auto">
          <Button 
            type="link" 
            icon={<HelpCircle />}
            onClick={() => setShowHelpModal(true)}
            className="text-purple-300 hover:text-white"
          >
            How to Play
          </Button>
        </div>
      </Content>

      {/* Help Modal */}
      <Modal
        title="How to Play"
        open={showHelpModal}
        onCancel={() => setShowHelpModal(false)}
        footer={[
          <Button key="gotit" type="primary" onClick={() => setShowHelpModal(false)}>
            Got it!
          </Button>
        ]}
        width={500}
      >
        <Space direction="vertical" size="large" className="w-full">
          <div>
            <Title level={5}>🎵 Single Player</Title>
            <Paragraph>
              Listen to music clips and guess the song title and artist. Earn points for correct answers!
            </Paragraph>
          </div>
          <div>
            <Title level={5}>👥 Multiplayer</Title>
            <Paragraph>
              Compete with friends in real-time. The fastest and most accurate player wins!
            </Paragraph>
          </div>
          <div>
            <Title level={5}>🏆 Scoring</Title>
            <Paragraph>
              Points are awarded based on accuracy and speed. Perfect matches earn bonus points!
            </Paragraph>
          </div>
        </Space>
      </Modal>
    </Layout>
  );
}
