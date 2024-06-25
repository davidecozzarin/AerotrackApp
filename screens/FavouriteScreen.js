import React, { useContext } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FavouriteContext } from '../context/FavouriteContext';
import { LinearGradient } from 'expo-linear-gradient';
import FlightDetails from '../components/FlightDetails';

/**
 * FavouriteScreen component displays the list of favorite flights.
 * Users can view details of each favorite flight and remove flights from favorites.
 */
const FavouriteScreen = () => {
  const { favorites, removeFromFavorites } = useContext(FavouriteContext);
  return (
    <LinearGradient colors={['#87CEEB', '#f5f5f5']} style={styles.container}>
      <Text style={styles.title}>FAVOURITES FLIGHTS</Text>
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {favorites.map((trip, index) => (
          <View key={index} style={styles.tripContainer}>
            <View style={styles.tripHeader}>
              <Text style={styles.tripTitle}>Total Price: {trip.totalPrice.toFixed(2)}€</Text>
              <TouchableOpacity onPress={() => removeFromFavorites(trip)}>
                <Icon name='heart' size={24} color='#ff4500' />
              </TouchableOpacity>
            </View>
            <View style={styles.flightContainer}>
              <View style={styles.flight}>
                <Text style={styles.flightTitle}>Outbound Flight</Text>
                <FlightDetails flight={trip.outboundFlights[0]} />
              </View>
              <View style={styles.flight}>
                <Text style={styles.flightTitle}>Return Flight</Text>
                <FlightDetails flight={trip.returnFlights[0]} />
              </View>
            </View>
            <View style={styles.durationContainer}>
              <Text style={styles.tripDuration}>
                Duration: {getDaysDifference(trip.outboundFlights[0].arrivalDateTime, trip.returnFlights[0].departureDateTime)} {dayOrDays(getDaysDifference(trip.outboundFlights[0].arrivalDateTime, trip.returnFlights[0].departureDateTime))}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const getDaysDifference = (date1Str, date2Str) => {
  const date1 = new Date(date1Str);
  const date2 = new Date(date2Str);
  const timeDiff = date2 - date1;
  return Math.floor(timeDiff / (1000 * 60 * 60 * 24) + 1);
};

const dayOrDays = (duration) => {
  return duration === 1 ? 'day' : 'days';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 75,
    marginBottom: 20,
    color: '#1a3036',
  },
  contentContainer: {
    flexGrow: 1,
  },
  tripContainer: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 12, 
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#F5F9F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a3036',
  },
  tripDuration: {
    fontSize: 16,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  flightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  flight: {
    width: '50%',
  },
  flightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#297687',
  },
  durationContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
});

export default FavouriteScreen;
