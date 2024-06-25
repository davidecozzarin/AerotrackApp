import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import ResultScreen from './screens/ResultScreen';
import MainTabs from './navigation/MainTabs';
import RegisterScreen from './screens/RegisterScreen';
import { FavouriteProvider } from './context/FavouriteContext';
import { AuthProvider } from './context/AuthContext';
import 'react-native-gesture-handler';

const Stack = createStackNavigator();

/**
 * App component that sets up the navigation container and stack navigator.
 * It also wraps the navigation with AuthProvider and FavouriteProvider 
 * to provide authentication and favorite management context to the app.
 */
const App = () => {
  
  return (
    <NavigationContainer>
      <AuthProvider>
        <FavouriteProvider>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="ResultScreen" component={ResultScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false}}  />
          </Stack.Navigator>
        </FavouriteProvider>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;
