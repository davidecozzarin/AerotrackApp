import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Heading from '../components/Heading';
import DatePicker from '../components/DatePicker';
import AirportPicker from '../components/AirportPicker';
import SubmitButton from '../components/SubmitButton';
import DaysPicker from '../components/DaysPicker';

/**
 * MainScreen component allows users to search for flights based on their availability and preferences.
 * Users can input the travel period, the minimum and maximum number of days for the trip, departure and destination airports.
 * The component fetches the airport data and sends a request to scan for available flights based on the provided criteria.
 */

const MainScreen = () => {
  const [minDays, setMinDays] = useState('1');
  const [maxDays, setMaxDays] = useState('1');
  const [availabilityStart, setAvailabilityStart] = useState('');
  const [availabilityEnd, setAvailabilityEnd] = useState('');
  const [departureAirports, setDepartureAirports] = useState([]);
  const [destinationAirports, setDestinationAirports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [airportJson, setAirportsJson] = useState(null);

  const navigation = useNavigation();

  // When the component mounts fetch the airportJson that contains airport data 
  useEffect(() => {
    const fetchAirportsJson = async () => {
      try {
        const response = await fetch('https://bfq0c9l0dl.execute-api.eu-west-1.amazonaws.com/prod/airports/merged', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'uT7NWMVVKt2ysdrCzxjMd7X6Ye64g7C5aI0xAiIc',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setAirportsJson(data);
      } catch (err) {
        console.error('Error fetching airports data:', err.message);
        Alert.alert('Error', 'Failed to fetch airports data');
      }
    };

    fetchAirportsJson();
  }, []);

  // Handle the submission of the flight search
  const handleSubmit = async () => {
    setIsLoading(true);

    // Validate input parameters
    if (!availabilityStart || !availabilityEnd) {
      Alert.alert('Error', 'Please fill in the dates fields.');
      setIsLoading(false);
      return;
    }

    if (parseInt(minDays, 10) > parseInt(maxDays, 10)) {
      Alert.alert('Error', 'Min Days must be <= than Max Days');
      setIsLoading(false);
      return;
    }

    const startDate = new Date(availabilityStart);
    const endDate = new Date(availabilityEnd);
    const today = new Date();
    const oneYearFromToday = new Date();
    oneYearFromToday.setFullYear(today.getFullYear() + 1);

    if (endDate > oneYearFromToday) {
      Alert.alert('Error', 'Availability end date must be within one year from today.');
      setIsLoading(false);
      return;
    }

    const availabilityWindow = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    if (parseInt(maxDays, 10) > availabilityWindow || parseInt(minDays, 10) > availabilityWindow) {
      Alert.alert('Error', `Days of travel must not exceed the availability window of ${availabilityWindow} days.`);
      setIsLoading(false);
      return;
    }

    if (departureAirports.length === 0 || destinationAirports.length === 0) {
      Alert.alert('Error', 'Please set at least one departure and one destination airport.');
      setIsLoading(false);
      return;
    }

    const requestPayload = {
      minDays: parseInt(minDays, 10),
      maxDays: parseInt(maxDays, 10),
      availabilityStart,
      availabilityEnd,
      departureAirports,
      destinationAirports,
      maxChanges: null,
      minTimeBetweenChangesHours: null,
      maxTimeBetweenChangesHours: null,
      returnToSameAirport: true,
    };
    console.log('Request Payload: ',requestPayload);    
    try {
      const response = await fetch('https://u4ck1qvmfe.execute-api.eu-west-1.amazonaws.com/prod/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'ySPfILwuHkgUiE36bYHH235s9AgFrGg7huBDcXo1',
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(errorData.message || 'Network response was not ok');
      }

      const data = await response.json();
      console.log('Response Data: ',data);
      if (data && data.trips && data.trips.length > 0) {     
        navigation.navigate('ResultScreen', { trips: data.trips });
      } else {
        Alert.alert('No Results', 'No flights found for the given criteria.');
      }
    } catch (err) {
      console.error('Error during scan:', err.message);
      Alert.alert('Error', `Cannot scan: ${err.message}. Remember not to use more than 5 months of availability, and availability after one year from now.`);
    }
    setIsLoading(false);
  };

  return (
    <LinearGradient
    colors={['#87CEEB', '#f5f5f5']}
    style={styles.container}>
      <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false} style={styles.scrollViewStyle}>
        <Heading />
        <View style={styles.dateInputContainer}>
          <DatePicker onDateChange={(startDate, endDate) => {
            setAvailabilityStart(startDate);
            setAvailabilityEnd(endDate);
          }} />
        </View>
        <View style={styles.daysPickerContainer}>
          <DaysPicker label="Minimum Days of Travel:" value={minDays} onValueChange={setMinDays} />
          <DaysPicker label="Maximum Days of Travel:" value={maxDays} onValueChange={setMaxDays} />
        </View>
        <View style={styles.airportPickerContainer}>
          <AirportPicker label="Departure Airports" selectedAirports={departureAirports} onAirportChange={setDepartureAirports} airportJson={airportJson} departureAirports={departureAirports}/>
        </View>
        <View style={styles.airportPickerContainer}>
          <AirportPicker label="Destination Airports" selectedAirports={destinationAirports} onAirportChange={setDestinationAirports} airportJson={airportJson} departureAirports={departureAirports}/>
        </View>
        <View style={styles.submitButtonContainer}>
          <SubmitButton onPress={handleSubmit} isLoading={isLoading} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewStyle: {
    flex: 1,
    paddingTop: 5,
  },
  dateInputContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  daysPickerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  airportPickerContainer: {
    marginTop: 20,
},
  submitButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
},
});

export default MainScreen;



