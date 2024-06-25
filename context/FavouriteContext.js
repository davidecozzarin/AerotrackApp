import React, { createContext, useState, useEffect, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './AuthContext';

export const FavouriteContext = createContext();

/**
 * FavouriteProvider component provides the favorites context to its children.
 * It handles loading, saving, adding, and removing favorite trips from AsyncStorage.
 */
export const FavouriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      loadFavorites(user.userId);
    } else {
      setFavorites([]);
    }
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        loadFavorites(user.userId);
      }
    }, [user])
  );

  /**
   * Load favorite trips from AsyncStorage based on the user's ID.
   * @param {string} userId - The user's ID.
   */
  const loadFavorites = async (userId) => {
    try {
      const storedFavorites = await AsyncStorage.getItem(`@userFavorites_${userId}`);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  /**
   * Save favorite trips to AsyncStorage.
   * @param {Array} updatedFavorites - The updated list of favorite trips.
   */
  const saveFavorites = async (updatedFavorites) => {
    if (user) {
      try {
        await AsyncStorage.setItem(`@userFavorites_${user.userId}`, JSON.stringify(updatedFavorites));
        setFavorites(updatedFavorites);
      } catch (error) {
        console.error('Error saving favorites:', error);
      }
    }
  };

  /**
   * Add a trip to the favorites list.
   * @param {Object} trip - The trip object to add to favorites.
   */
  const addToFavorites = (trip) => {
    if (!isFavorite(trip)) {
      const updatedFavorites = [...favorites, trip];
      saveFavorites(updatedFavorites);
    }
  };

  /**
   * Remove a trip from the favorites list.
   * @param {Object} trip - The trip object to remove from favorites.
   */
  const removeFromFavorites = (trip) => {
    const updatedFavorites = favorites.filter(fav =>
      !(
        fav.outboundFlights[0].departureDateTime === trip.outboundFlights[0].departureDateTime &&
        fav.returnFlights[0].departureDateTime === trip.returnFlights[0].departureDateTime &&
        fav.outboundFlights[0].direction === trip.outboundFlights[0].direction &&
        fav.returnFlights[0].direction === trip.returnFlights[0].direction
      )
    );
    saveFavorites(updatedFavorites);
  };

  /**
   * Check if a trip is in the favorites list.
   * @param {Object} trip - The trip object to check.
   * @returns {boolean} - True if the trip is in the favorites list, false otherwise.
   */
  const isFavorite = (trip) => {
    return favorites.some(fav =>
      fav.outboundFlights[0].departureDateTime === trip.outboundFlights[0].departureDateTime &&
      fav.returnFlights[0].departureDateTime === trip.returnFlights[0].departureDateTime &&
      fav.outboundFlights[0].direction === trip.outboundFlights[0].direction &&
      fav.returnFlights[0].direction === trip.returnFlights[0].direction
    );
  };

  return (
    <FavouriteContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite, setFavorites }}>
      {children}
    </FavouriteContext.Provider>
  );
};