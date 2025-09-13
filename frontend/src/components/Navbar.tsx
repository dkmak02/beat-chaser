'use client';

import React, { useState } from 'react';
import { Layout, Button, Space, Avatar, Dropdown, theme } from 'antd';
import { useRouter } from 'next/navigation';
import { LoginModal, SignUpModal, ProfileModal } from '../components';
import { useRegisterMutation, useLoginMutation } from '../hooks/useAuth';
import { useAuth } from '../contexts/AuthContext';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';

const { Header } = Layout;

export default function Navbar() {
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Auth context
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth();

  // React Query mutations
  const registerMutation = useRegisterMutation();
  const loginMutation = useLoginMutation();

  const showLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const showSignUpModal = () => {
    setIsSignUpModalOpen(true);
  };

  const showProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const handleLoginCancel = () => {
    setIsLoginModalOpen(false);
  };

  const handleSignUpCancel = () => {
    setIsSignUpModalOpen(false);
  };

  const handleSignUpCancel2 = () => {
    setIsProfileModalOpen(false);
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
  };

  const handleSignUpSuccess = () => {
    setIsSignUpModalOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  const handleHomeClick = () => {
    router.push('/');
  };

  // Dropdown menu for authenticated user
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profil',
      onClick: showProfileModal,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Wyloguj',
      onClick: handleLogout,
    },
  ];

  return (
    <>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {/* Logo/Brand */}
        <div 
          style={{ 
            color: 'white', 
            fontSize: '20px', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
          onClick={handleHomeClick}
        >
          🎵 Beat Chaser
        </div>

        {/* Auth Section */}
        <Space size="middle">
          {isAuthenticated ? (
            // Authenticated user dropdown
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Button
                type="text"
                style={{
                  color: 'white',
                  display: 'flex', 
                  alignItems: 'center',
                  height: 'auto',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Avatar 
                  size="small" 
                  icon={<UserOutlined />} 
                  style={{ marginRight: 8 }} 
                />
                <span style={{ fontSize: '14px', fontWeight: '500' }}>
                  {user?.username}
                </span>
              </Button>
            </Dropdown>
          ) : (
            // Non-authenticated user buttons
            <>
              <Button type="default" size="middle" onClick={showSignUpModal}>
                Sign Up
              </Button>
              <Button type="primary" size="middle" onClick={showLoginModal}>
                Login
              </Button>
            </>
          )}
        </Space>
      </Header>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onCancel={handleLoginCancel}
        onSubmit={(values) => {
          loginMutation.mutate(values, {
            onSuccess: () => {
              setIsLoginModalOpen(false);
            }
          });
        }}
        isLoading={loginMutation.isPending}
      />
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onCancel={handleSignUpCancel}
        onSubmit={(values) => {
          registerMutation.mutate(values, {
            onSuccess: () => {
              setIsSignUpModalOpen(false);
            }
          });
        }}
        isLoading={registerMutation.isPending}
      />
      <ProfileModal
        isOpen={isProfileModalOpen}
        onCancel={handleSignUpCancel2}
        user={user}
      />
    </>
  );
}
