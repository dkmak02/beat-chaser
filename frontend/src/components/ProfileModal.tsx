'use client';

import { Modal, Descriptions, Avatar, Button, Typography, Space, Divider } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import { User } from '../contexts/AuthContext';

const { Title } = Typography;

interface ProfileModalProps {
  isOpen: boolean;
  onCancel: () => void;
  user: User | null;
}

export default function ProfileModal({ isOpen, onCancel, user }: ProfileModalProps) {
  if (!user) return null;

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar size={32} icon={<UserOutlined />} />
          <span>Profil użytkownika</span>
        </div>
      }
      open={isOpen}
      onCancel={onCancel}
      footer={[
        <Button key="edit" type="primary" icon={<EditOutlined />}>
          Edytuj profil
        </Button>,
        <Button key="close" onClick={onCancel}>
          Zamknij
        </Button>,
      ]}
      width={500}
    >
      <div style={{ padding: '20px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Avatar size={80} icon={<UserOutlined />} style={{ marginBottom: 16 }} />
          <Title level={3} style={{ margin: 0 }}>
            {user.username}
          </Title>
        </div>

        <Divider />

        <Descriptions column={1} size="middle">
          <Descriptions.Item label="Nazwa użytkownika">
            <strong>{user.username}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            <strong>{user.email}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="ID użytkownika">
            <code>{user.id}</code>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <span style={{ color: '#52c41a' }}>●</span> Aktywny
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <div>
          <Title level={5}>Statystyki gry</Title>
          <Descriptions column={2} size="small">
            <Descriptions.Item label="Rozegrane gry">
              <strong>0</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Wygrane">
              <strong>0</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Najlepszy wynik">
              <strong>-</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Poziom">
              <strong>Początkujący</strong>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </Modal>
  );
}
