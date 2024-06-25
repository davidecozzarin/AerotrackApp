import React, { useState } from 'react';
import { Alert, StyleSheet, Image, Text } from 'react-native';
import axios from 'axios';
import { TextInput, Button, } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * RegisterScreen component handles user registration functionality.
 */
const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

   /**
   * Handles user registration.
   */
  const handleRegister = async () => {
    if (!username || !password || !email) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }
    console.log('Attempting to register:', username, password, email);
    try {
      const response = await axios.post('http://172.20.10.3:5000/api/auth/register', { username, password, email });
      console.log('Response from server:', response.data);
      Alert.alert('Success', 'User registered successfully');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error registering user:', error);
      Alert.alert('Error', 'Error registering user');
    }
  };

  return (
    <LinearGradient
    colors={['#87CEEB', '#f5f5f5']}
    style={styles.container}>
      <Text style={styles.title} >AEROTRACK</Text>
      <Image source={require('../assets/images/AerotrackLogoDef.png')} style={styles.logo} />
      <TextInput
        label="Username"
        mode="outlined"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        theme={{ colors: { primary: '#297687' } }}
      />
      <TextInput
        label="Password"
        mode="outlined"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        theme={{ colors: { primary: '#297687' } }} 
      />
      <TextInput
        label="Email"
        mode="outlined"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        theme={{ colors: { primary: '#297687' } }} 
      />
      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Register
      </Button>
      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Already have an account? Login
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 40, 
    color: '#1a3036',
    fontWeight: 'bold',
  },
  logo: {
    width: 200,
    height: 200,
  },
  input: {
    width: '100%',
    marginBottom: 10,
  },
  button: {
    width: '100%',
    marginVertical: 10,
    backgroundColor: '#297687',
  },
  link: {
    width: '100%',
    marginVertical: 5,
    color: '#297687',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
  },
});

export default RegisterScreen;
