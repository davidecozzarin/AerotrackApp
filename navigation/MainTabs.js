import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MainScreen from '../screens/MainScreen';
import FavouriteScreen from '../screens/FavouriteScreen';
import UserProfileScreen from '../screens/UserProfileScreen';

const Tab = createBottomTabNavigator();

/**
 * MainTabs component defines the tab navigation structure.
 * It includes three tabs: Search, Favourites, and Profile.
 */
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={( { route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Search') {
            iconName = focused ? 'airplane' : 'airplane-outline';
          } else if (route.name === 'Favourites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1a3036',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {backgroundColor: '#cdf2fa'},
      })}
    >
        <Tab.Screen name="Search" component={MainScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Favourites" component={FavouriteScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Profile" component={UserProfileScreen} options={{ headerShown: false }}/>
    </Tab.Navigator>
  );
};

export default MainTabs;
