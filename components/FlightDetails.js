import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * FlightDetails component displays the details of a flight.
 * @param {Object} flight - The flight object containing flight details.
 */
const FlightDetails = ({ flight }) => (
  <View style={styles.flightDetailsContainer}>
    <Text>Flight: {flight.direction}</Text>
    <Text>Departure: {formatDate(flight.departureDateTime)}</Text>
    <Text>Arrival: {formatDate(flight.arrivalDateTime)}</Text>
    <Text>Price: {flight.price.toFixed(2)}€</Text>
  </View>
);

const formatDate = (dateTime) => {
  const date = new Date(dateTime);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

const styles = StyleSheet.create({
  flightDetailsContainer: {
    marginVertical: 5,
  },
});

export default FlightDetails;
