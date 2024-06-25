import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const AuthContext = createContext();

/**
 * AuthProvider component to manage authentication state and operations.
 * @param {Object} children - The child components that will have access to the context.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  /**
   * Load user data from AsyncStorage when the component mounts.
   */
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    loadUser();
  }, []);

  /**
   * SignIn function to handle user login.
   */
  const signIn = async (username, password) => {
    try {
      const res = await axios.post('http://172.20.10.3:5000/api/auth/login', { username, password });
      if (res.data.token) {
        const userData = { username, userId: res.data.userId };
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        console.log('Login successful:', res.data);
      } else {
        console.error('Login failed: no token received');
      }
    } catch (error) {
      if (error.response) {
        console.error('Login error (response):', error.response.data);
      } else if (error.request) {
        console.error('Login error (request):', error.request);
      } else {
        console.error('Login error (message):', error.message);
      }
      alert('Invalid credentials');
    }
  };

  /**
   * SignOut function to handle user logout.
   */
  const signOut = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

