'use client';
import '@ant-design/v5-patch-for-react-19';
import { Button, Typography, theme, Card, Row, Col } from 'antd';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { PlayCircleOutlined, TeamOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const {
    token: { colorBgContainer, borderRadiusLG, colorBgLayout },
  } = theme.useToken();

  // Show loading state
  if (authLoading) {
    return (
      <div style={{ 
        padding: '0 48px', 
        height: '100%',
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div>Ładowanie...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '24px 48px', 
      height: '100%',
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'auto',
      background: colorBgLayout
    }}>
      <div
        style={{
          background: colorBgContainer,
          flex: 1,
          padding: 24,
          borderRadius: borderRadiusLG,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          minHeight: 0,
        }}
      >
        {isAuthenticated ? (
          // Authenticated user - Game mode selection
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <Title level={2}>Witaj, {user?.username}! 🎵</Title>
              <Typography.Paragraph style={{ fontSize: '16px', color: '#666' }}>
                Wybierz tryb gry i sprawdź swoją wiedzę muzyczną!
              </Typography.Paragraph>
            </div>

            <div style={{ flex: '0 0 auto' }}>
              <Row gutter={[24, 24]} justify="center" style={{ marginBottom: 48 }}>
                {/* Singleplayer Card */}
                <Col xs={24} sm={12} lg={8}>
                  <Card
                    hoverable
                    style={{ 
                      height: '200px',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onClick={() => router.push('/game/configure?mode=singleplayer')}
                    cover={
                      <div style={{
                        height: '100px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '12px 12px 0 0'
                      }}>
                        <PlayCircleOutlined style={{ fontSize: '48px', color: 'white' }} />
                      </div>
                    }
                    actions={[
                      <Button 
                        type="primary" 
                        size="large" 
                        style={{ width: '80%' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push('/game/configure?mode=singleplayer');
                        }}
                      >
                        Graj Solo
                      </Button>
                    ]}
                  >
                    <Card.Meta
                      title={<span style={{ fontSize: '18px', fontWeight: 'bold' }}>Singleplayer</span>}
                      description="Graj w swoim tempie i poprawiaj swoje wyniki"
                    />
                  </Card>
                </Col>

                {/* Multiplayer Card */}
                <Col xs={24} sm={12} lg={8}>
                  <Card
                    hoverable
                    style={{ 
                      height: '200px',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onClick={() => router.push('/game/configure?mode=multiplayer')}
                    cover={
                      <div style={{
                        height: '100px',
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '12px 12px 0 0'
                      }}>
                        <TeamOutlined style={{ fontSize: '48px', color: 'white' }} />
                      </div>
                    }
                    actions={[
                      <Button 
                        type="primary" 
                        size="large" 
                        style={{ width: '80%', backgroundColor: '#f5576c', borderColor: '#f5576c' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push('/game/configure?mode=multiplayer');
                        }}
                      >
                        Graj z Innymi
                      </Button>
                    ]}
                  >
                    <Card.Meta
                      title={<span style={{ fontSize: '18px', fontWeight: 'bold' }}>Multiplayer</span>}
                      description="Rywalizuj z innymi graczami online"
                    />
                  </Card>
                </Col>
              </Row>
            </div>

            {/* Quick Stats */}
            <div style={{ marginTop: 32, textAlign: 'center', paddingTop: '24px', borderTop: '1px solid #f0f0f0' }}>
              <Typography.Text type="secondary">
                Twoje statystyki: 0 gier rozegranych | Najlepszy wynik: 0
              </Typography.Text>
            </div>
          </div>
        ) : (
          // Non-authenticated user - Login prompt
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 32 }}>
              <LockOutlined style={{ fontSize: '64px', color: '#faad14', marginBottom: 16 }} />
              <Title level={2}>Zaloguj się, aby grać! 🎵</Title>
              <Typography.Paragraph style={{ fontSize: '16px', color: '#666', maxWidth: '500px', margin: '0 auto' }}>
                Beat Chaser to gra muzyczna, która sprawdzi Twoją wiedzę! 
                Aby rozpocząć grę, musisz się zalogować lub utworzyć nowe konto.
              </Typography.Paragraph>
            </div>

            <div style={{ marginBottom: 24 }}>
              <Typography.Title level={4} style={{ color: '#1677ff' }}>
                Co Cię czeka po zalogowaniu:
              </Typography.Title>
              <Row gutter={16} justify="center" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <Col span={8}>
                  <div style={{ textAlign: 'center', padding: '16px' }}>
                    <PlayCircleOutlined style={{ fontSize: '32px', color: '#667eea', marginBottom: '8px' }} />
                    <div style={{ fontWeight: 'bold' }}>Gra Solo</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Trenuj w swoim tempie</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: 'center', padding: '16px' }}>
                    <TeamOutlined style={{ fontSize: '32px', color: '#f5576c', marginBottom: '8px' }} />
                    <div style={{ fontWeight: 'bold' }}>Multiplayer</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Rywalizuj z innymi</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: 'center', padding: '16px' }}>
                    <LockOutlined style={{ fontSize: '32px', color: '#faad14', marginBottom: '8px' }} />
                    <div style={{ fontWeight: 'bold' }}>Statystyki</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Śledź swoje postępy</div>
                  </div>
                </Col>
              </Row>
            </div>

            <Typography.Paragraph style={{ fontSize: '14px', color: '#999', marginTop: '32px' }}>
              👆 Zaloguj się lub załóż konto używając przycisków w górnym menu
            </Typography.Paragraph>
          </div>
        )}
      </div>
    </div>
  );
}
