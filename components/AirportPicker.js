import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

const airports = [
  { code: 'VIE', name: 'Austria - Vienna (Vienna International Airport)' },
  { code: 'BRU', name: 'Belgium - Brussels (Brussels Airport)' },
  { code: 'PRG', name: 'Czech Republic - Prague (Václav Havel Airport Prague)' },
  { code: 'CPH', name: 'Denmark - Copenhagen (Copenhagen Airport)' },
  { code: 'HEL', name: 'Finland - Helsinki (Helsinki Airport)' },
  { code: 'NCE', name: 'France - Nice (Nice Côte d\'Azur Airport)' },
  { code: 'CDG', name: 'France - Paris (Charles de Gaulle Airport)' },
  { code: 'ORY', name: 'France - Paris (Orly Airport)' },
  { code: 'TXL', name: 'Germany - Berlin (Berlin Tegel Airport)' },
  { code: 'DUS', name: 'Germany - Düsseldorf (Düsseldorf Airport)' },
  { code: 'FRA', name: 'Germany - Frankfurt (Frankfurt Airport)' },
  { code: 'HAM', name: 'Germany - Hamburg (Hamburg Airport)' },
  { code: 'MUC', name: 'Germany - Munich (Munich Airport)' },
  { code: 'STR', name: 'Germany - Stuttgart (Stuttgart Airport)' },
  { code: 'ATH', name: 'Greece - Athens (Athens International Airport)' },
  { code: 'JMK', name: 'Greece - Mykonos (Mykonos Airport)' },
  { code: 'JTR', name: 'Greece - Santorini (Santorini Airport)' },
  { code: 'DUB', name: 'Ireland - Dublin (Dublin Airport)' },
  { code: 'BUD', name: 'Hungary - Budapest (Budapest Ferenc Liszt International Airport)' },
  { code: 'BLQ', name: 'Italy - Bologna (Bologna Guglielmo Marconi Airport)' },
  { code: 'MXP', name: 'Italy - Milan (Milan Malpensa Airport)' },
  { code: 'NAP', name: 'Italy - Naples (Naples International Airport)' }, 
  { code: 'FCO', name: 'Italy - Rome (Leonardo da Vinci–Fiumicino Airport)' },
  { code: 'TRS', name: 'Italy - Trieste (Trieste–Friuli Venezia Giulia Airport)' },
  { code: 'VCE', name: 'Italy - Venezia (Venezia Marco Polo)' },
  { code: 'TSF', name: 'Italy - Venice (Treviso Airport)' },
  { code: 'MLA', name: 'Malta - Luqa (Malta International Airport)' },
  { code: 'AMS', name: 'Netherlands - Amsterdam (Amsterdam Airport Schiphol)' },
  { code: 'EIN', name: 'Netherlands - Eindhoven (Eindhoven Airport)' },
  { code: 'OSL', name: 'Norway - Oslo (Oslo Airport Gardermoen)' },
  { code: 'WAW', name: 'Poland - Warsaw (Warsaw Chopin Airport)' },
  { code: 'LIS', name: 'Portugal - Lisbon (Lisbon Airport)' },
  { code: 'OTP', name: 'Romania - Bucharest (Henri Coandă International Airport)' },
  { code: 'DME', name: 'Russia - Moscow (Domodedovo International Airport)' },
  { code: 'SVO', name: 'Russia - Moscow (Sheremetyevo International Airport)' },
  { code: 'BCN', name: 'Spain - Barcelona (Barcelona–El Prat Airport)' },
  { code: 'LPA', name: 'Spain - Gran Canaria (Gran Canaria Airport)' },
  { code: 'ACE', name: 'Spain - Lanzarote (Lanzarote Airport)' },
  { code: 'MAD', name: 'Spain - Madrid (Adolfo Suárez Madrid–Barajas Airport)' },
  { code: 'PMI', name: 'Spain - Palma de Mallorca (Palma de Mallorca Airport)' },
  { code: 'TFN', name: 'Spain - Tenerife North (Tenerife North Airport)' },
  { code: 'TFS', name: 'Spain - Tenerife South (Tenerife South Airport)' },
  { code: 'VLC', name: 'Spain - Valencia (Valencia Airport)' },
  { code: 'ARN', name: 'Sweden - Stockholm (Stockholm Arlanda Airport)' },
  { code: 'ZRH', name: 'Switzerland - Zurich (Zurich Airport)' },
  { code: 'GVA', name: 'Switzerland - Geneva (Geneva Airport)' },
  { code: 'IST', name: 'Turkey - Istanbul (Istanbul Airport)' },
  { code: 'BHX', name: 'United Kingdom - Birmingham (Birmingham Airport)' },
  { code: 'BRS', name: 'United Kingdom - Bristol (Bristol Airport)' },
  { code: 'EDI', name: 'United Kingdom - Edinburgh (Edinburgh Airport)' },
  { code: 'GLA', name: 'United Kingdom - Glasgow (Glasgow Airport)' },
  { code: 'LBA', name: 'United Kingdom - Leeds (Leeds Bradford Airport)' },
  { code: 'LHR', name: 'United Kingdom - London (Heathrow Airport)' },
  { code: 'LGW', name: 'United Kingdom - London (Gatwick Airport)' },
  { code: 'MAN', name: 'United Kingdom - Manchester (Manchester Airport)' },
  { code: 'SEN', name: 'United Kingdom - Southend (London Southend Airport)' },
  { code: 'STN', name: 'United Kingdom - London (London Stansted Airport)' },
];

/**
 * AirportSelector component for selecting airports.
 */
const AirportPicker = ({ label, selectedAirports, onAirportChange, airportJson, departureAirports }) => {
  const [modalVisible, setModalVisible] = useState(false);

  /**
   * Handle the selection the airport  
   */
  const handleConfirmSelection = (airport) => {
    const newSelectedAirports = selectedAirports.includes(airport.code)
      ? selectedAirports.filter(a => a !== airport.code)
      : [...selectedAirports, airport.code];
    onAirportChange(newSelectedAirports);
    setModalVisible(false);
  };

  const handleRemoveAirport = (airport) => {
    const newSelectedAirports = selectedAirports.filter(a => a !== airport);
    onAirportChange(newSelectedAirports);
  };

  /**
   * Get available destination airports based on the selected departure airports
   */
  const getAvailableDestinations = (label, airportJson, departureAirports, airports) => {
    if (label === "Destination Airports") {
      let availableDestinations = [];
      if (airportJson && airportJson.airports && departureAirports && departureAirports.length > 0) {
        departureAirports.forEach(departureAirportCode => {
          const departureAirport = airportJson.airports.find(airport => airport.airportCode === departureAirportCode);
          if (departureAirport && departureAirport.connections && departureAirport.connections.length > 0) {
            departureAirport.connections.forEach(connectionCode => {
              const destinationAirport = airports.find(airport => airport.code === connectionCode);
              if (destinationAirport && !availableDestinations.some(airport => airport === destinationAirport)) {
                availableDestinations.push(destinationAirport);
              }
            });
          }
        });
      }
      const uniqueFullAirports = Array.from(new Set(availableDestinations.map(airport => airport.code)))
        .map(code => availableDestinations.find(airport => airport.code === code));
      return uniqueFullAirports;
    } else {
      return airports.filter(airport => !selectedAirports.includes(airport.code));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}:</Text>
      <TouchableOpacity style={styles.pickerContainer} onPress={() => setModalVisible(true)}>
        <Text style={styles.pickerInput}>Select...</Text>
        <Icon name="down-square-o" size={24} color="#297687" />
      </TouchableOpacity>
      <ScrollView style={styles.selectedContainer} showsVerticalScrollIndicator={false}>
        {selectedAirports.map((airport, index) => (
          <View key={index} style={styles.selectedItem}>
            <Text style={styles.selectedText}>{airports.find(a => a.code === airport).name} ({airport})</Text>
            <TouchableOpacity onPress={() => handleRemoveAirport(airport)} style={styles.removeButton}>
              <Icon name="closecircle" size={24} color="#ff4500" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={getAvailableDestinations(label, airportJson, departureAirports, airports)}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => handleConfirmSelection(item)}>
                  <Text>{item.name} ({item.code})</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a3036',
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: '#297687',
    borderRadius: 4,
    backgroundColor: '#F5F9F6',
    marginBottom: 5,
    paddingHorizontal: 10,
    height: 45,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
  },
  pickerInput: {
    fontSize: 16,
    color: '#1a3036',
  },
  selectedContainer: {
    maxHeight: 200,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#297687',
    borderRadius: 5,
    padding: 5,
    marginVertical: 2,
    marginRight: 2,
    borderRadius: 15,
  },
  selectedText: {
    flex: 1,
    marginRight: 5,
    color: '#1a3036',
  },
  removeButton: {
    padding: 8,
    alignItems: 'center',
    height: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#F5F9F6',
    borderRadius: 30,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#7aabb6',
  },
  modalCloseButton: {
    marginTop: 10,
    backgroundColor: '#297687',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AirportPicker;