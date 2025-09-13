import { useMutation } from '@tanstack/react-query';
import { authAPI, RegisterRequest, LoginRequest, AuthResponse } from '../services/authAPI';
import { message } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import { extractUserDataFromJWT } from '../utils/jwt';

// Hook for user registration
export const useRegisterMutation = () => {
  const { login } = useAuth();
  
  return useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: authAPI.register,
    onSuccess: (data) => {
      message.success('Konto zostało utworzone pomyślnie!');
      
      // Update auth context with user data
      const user = extractUserDataFromJWT(data.token);
      if (user) {
        login(user, data.token);
      } else {
        message.error('Błąd podczas przetwarzania danych użytkownika');
      }
    },
    onError: (error: any) => {
      console.error('Registration error:', error);
      
      // Handle specific error cases
      if (error.response?.status === 409) {
        message.error('Użytkownik z tym emailem już istnieje');
      } else if (error.response?.status === 400) {
        message.error('Nieprawidłowe dane. Sprawdź wszystkie pola.');
      } else {
        message.error('Wystąpił błąd podczas rejestracji. Spróbuj ponownie.');
      }
    },
  });
};

// Hook for user login
export const useLoginMutation = () => {
  const { login } = useAuth();
  
  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      message.success('Zalogowano pomyślnie!');
      console.log('Login successful:', data);
      
      // Update auth context with user data from JWT token
      const user = extractUserDataFromJWT(data.token);
      if (user) {
        login(user, data.token);
      } else {
        message.error('Błąd podczas przetwarzania danych użytkownika');
      }
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        message.error('Nieprawidłowy email lub hasło');
      } else if (error.response?.status === 404) {
        message.error('Użytkownik nie został znaleziony');
      } else {
        message.error('Wystąpił błąd podczas logowania. Spróbuj ponownie.');
      }
    },
  });
};
