import React, { useState, useContext, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FavouriteContext } from '../context/FavouriteContext';
import FlightDetails from '../components/FlightDetails';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { LinearGradient } from 'expo-linear-gradient';

/** 
 * ResultScreen component displays the search results for flights.
 *  Allows users to filter results by direction and price, and manage favorites.
*/
const ResultScreen = ({ route }) => {
  const { trips } = route.params; // Retrieve trips from route parameters
  const { addToFavorites, removeFromFavorites, isFavorite } = useContext(FavouriteContext); 
  const [filteredTrips, setFilteredTrips] = useState(trips); 
  const [directions, setDirections] = useState([]); 
  const [selectedDirection, setSelectedDirection] = useState(null); 
  const [selectedMinPrice, setSelectedMinPrice] = useState(0); 
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(Math.max(...trips.map(trip => trip.totalPrice))); 
  const [showPriceFilter, setShowPriceFilter] = useState(false); 

  useEffect(() => {
    const uniqueDirections = new Set();
    trips.forEach(trip => {
      uniqueDirections.add(trip.outboundFlights[0].direction);
    });
    setDirections(Array.from(uniqueDirections));
  }, [trips]);
  
  /**
   * Function to filter trips based on selected direction and price range
   */
  const filterTrips = (direction) => {
    setSelectedDirection(direction);
    if (direction) {
      setFilteredTrips(trips.filter(trip =>
        trip.outboundFlights[0].direction === direction &&
        trip.totalPrice >= selectedMinPrice && trip.totalPrice <= selectedMaxPrice
      ));
    } else {
      setFilteredTrips(trips.filter(trip => 
        trip.totalPrice >= selectedMinPrice && trip.totalPrice <= selectedMaxPrice
      ));
    }
  };

  const applyPriceFilter = () => {
    filterTrips(selectedDirection);
    setShowPriceFilter(false);
  };

  return (
    <LinearGradient colors={['#87CEEB', '#f5f5f5']} style={styles.container}>
      <Text style={styles.title}>Flight Search Results</Text>
      <View style={styles.filterContainer}>
        {directions.map((direction, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.filterButton, selectedDirection === direction && styles.selectedFilterButton]}
            onPress={() => filterTrips(direction)}
          >
            <Text style={styles.filterButtonText}>{direction}</Text>
          </TouchableOpacity>
        ))}
        {selectedDirection && (
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => filterTrips(null)}
          >
            <Text style={styles.filterButtonText}>Show All</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowPriceFilter(!showPriceFilter)}
        >
          <Text style={styles.filterButtonText}>Filter by Price</Text>
        </TouchableOpacity>
      </View>
      {showPriceFilter && (
        <View style={styles.priceFilterContainer}>
          <Text>Min Price: €{selectedMinPrice}</Text>
          <Text>Max Price: €{selectedMaxPrice}</Text>
          <MultiSlider
            values={[selectedMinPrice, selectedMaxPrice]}
            sliderLength={300}
            onValuesChange={(values) => {
              setSelectedMinPrice(values[0]);
              setSelectedMaxPrice(values[1]);
            }}
            min={0}
            max={Math.max(...trips.map(trip => trip.totalPrice))}
            step={1}
            allowOverlap={false}
            snapped
            containerStyle={styles.sliderContainer}
            trackStyle={styles.sliderTrack}
            selectedStyle={styles.sliderSelected}
            unselectedStyle={styles.sliderUnselected}
          />
          <TouchableOpacity
            style={styles.applyButton}
            onPress={applyPriceFilter}
          >
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      )}
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {filteredTrips.map((trip, index) => (
          <View key={index} style={styles.tripContainer}>
            <View style={styles.tripHeader}>
              <Text style={styles.tripTitle}>Total Price: {trip.totalPrice}€</Text>
              <TouchableOpacity onPress={() => isFavorite(trip) ? removeFromFavorites(trip) : addToFavorites(trip)}>
                <Icon name={isFavorite(trip) ? 'heart' : 'heart-o'} size={24} color={isFavorite(trip) ? '#ff4500' : 'black'} />
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
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 5,
    backgroundColor: '#5AA2B0',
    borderRadius: 20,
  },
  selectedFilterButton: {
    backgroundColor: '#297687',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  priceFilterContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
    alignSelf: 'center',
  },
  applyButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#297687',
    borderRadius: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
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
    alignItems: 'center',
    marginBottom: 10,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a3036',
  },
  tripDuration: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  flightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
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
  sliderContainer: {
    alignSelf: 'center',
    marginTop: 20,
  },
  sliderTrack: {
    height: 4,
    borderRadius: 2,
  },
  sliderSelected: {
    backgroundColor: '#297687',
  },
  sliderUnselected: {
    backgroundColor: '#ccc',
  },
  durationContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
});

export default ResultScreen;
