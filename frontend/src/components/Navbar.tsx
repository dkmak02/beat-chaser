'use client';

import { useState } from 'react';
import { User, LogIn, LogOut, Music, UserPlus } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

export default function Navbar() {
  const { isLoggedIn, username, login, logout } = useUser();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signInUsername, setSignInUsername] = useState('');
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (loginUsername.trim() && loginPassword.trim()) {
      setIsLoading(true);
      try {
        // Call backend login API
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: loginUsername,
            password: loginPassword
          })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Store the JWT token if needed
          localStorage.setItem('token', data.data.token);
          login(loginUsername);
          setShowLoginModal(false);
          setLoginUsername('');
          setLoginPassword('');
        } else {
          console.error('Login failed:', data.message);
          alert(data.message || 'Login failed. Please check your credentials.');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSignIn = async () => {
    if (signInUsername.trim() && signInEmail.trim() && signInPassword.trim()) {
      setIsLoading(true);
      try {
        // Call backend registration API
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: signInUsername,
            email: signInEmail,
            password: signInPassword
          })
        });

        if (response.ok) {
          const data = await response.json();
          login(signInUsername);
          setShowSignInModal(false);
          setSignInUsername('');
          setSignInEmail('');
          setSignInPassword('');
        } else {
          const errorData = await response.json();
          console.error('Registration failed:', errorData.message);
          // You could show an error message to the user here
          alert('Registration failed: ' + errorData.message);
        }
      } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLogout = () => {
    logout();
  };

  const closeModal = (modalType: 'login' | 'signin') => {
    if (modalType === 'login') {
      setShowLoginModal(false);
      setLoginUsername('');
      setLoginPassword('');
    } else {
      setShowSignInModal(false);
      setSignInUsername('');
      setSignInEmail('');
      setSignInPassword('');
    }
  };

  return (
    <header className="bg-gradient-to-r from-purple-900 to-blue-900 border-0 px-6 fixed w-full top-0 z-50 h-16">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-full">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
            <Music className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-white text-xl font-bold mb-0">
            Beat Chaser
          </h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex justify-center">
          <ul className="flex space-x-8">
            <li><a href="/" className="text-gray-300 hover:text-white">Home</a></li>
            <li><a href="/config/singleplayer" className="text-gray-300 hover:text-white">Single Player</a></li>
            <li><a href="/config/multiplayer" className="text-gray-300 hover:text-white">Multi Player</a></li>
          </ul>
        </nav>

        {/* User Section */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="text-white">{username}</span>
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm flex items-center space-x-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setShowLoginModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm flex items-center space-x-1"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
              <button 
                onClick={() => setShowSignInModal(true)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded text-sm flex items-center space-x-1"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-96 shadow-2xl border border-gray-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-black mb-2">Welcome Back!</h2>
              <p className="text-black">Sign in to continue your music journey</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleLogin}
                  disabled={isLoading || !loginUsername.trim() || !loginPassword.trim()}
                  className="flex-1 bg-purple-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
                <button
                  onClick={() => closeModal('login')}
                  className="px-4 py-3 border border-gray-300 text-black rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
              <div className="text-center pt-4">
                <p className="text-black text-sm">
                  Don't have an account?{' '}
                  <button 
                    onClick={() => {
                      closeModal('login');
                      setShowSignInModal(true);
                    }}
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sign In Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-96 shadow-2xl border border-gray-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-black mb-2">Join Beat Chaser!</h2>
              <p className="text-black">Create your account and start guessing</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Username</label>
                <input
                  type="text"
                  placeholder="Choose a username"
                  value={signInUsername}
                  onChange={(e) => setSignInUsername(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Choose a password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSignIn}
                  disabled={isLoading || !signInUsername.trim() || !signInEmail.trim() || !signInPassword.trim()}
                  className="flex-1 bg-blue-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
                <button
                  onClick={() => closeModal('signin')}
                  className="px-4 py-3 border border-gray-300 text-black rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
              <div className="text-center pt-4">
                <p className="text-black text-sm">
                  Already have an account?{' '}
                  <button 
                    onClick={() => {
                      closeModal('signin');
                      setShowLoginModal(true);
                    }}
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 