import { useNavigation } from '@react-navigation/native';
import React, { useState, useContext } from 'react';
import { StyleSheet, Alert, Image, Text } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { TextInput, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * LoginScreen component handles the login functionality for the app. 
 */
const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const navigation = useNavigation();
  const { signIn } = useContext(AuthContext);

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    signIn(username, password); 
    console.log('Username:', username);
    console.log('Password:', password);
    setUsername('');
    setPassword('');
    navigation.navigate('MainTabs');
  };

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
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
        secureTextEntry={secureTextEntry}
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        theme={{ colors: { primary: '#297687' } }} 
        right={<TextInput.Icon icon = {secureTextEntry ? "eye" : "eye-off" } onPress={toggleSecureEntry}/>}
      />
      <Button mode="contained" onPress={handleLogin} style={styles.loginButton}>
        Login
      </Button>
      <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
        Register
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
  loginButton: {
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

export default LoginScreen;
