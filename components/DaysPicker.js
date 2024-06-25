import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

/**
 * DaysPicker component allows the user to select a number of days from 1 to 31.
 * The selection is displayed in a horizontal ScrollView.
 * @param {string} label - The label for the DaysPicker.
 * @param {string} value - The currently selected value.
 * @param {function} onValueChange - Callback function to handle the change in value.
 */
const DaysPicker = ({ label, value, onValueChange }) => {
  const [selectedValue, setSelectedValue] = useState(value);
  const scrollViewRef = useRef(null);
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  /**
   * useEffect hook to scroll to the selected value when the component mounts
   * or when the value prop changes.
   */
  useEffect(() => {
    const index = days.indexOf(value);
    if (index !== -1 && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: index * 50, animated: true });
    }
  }, [value]);

  /**
   * Handle the scroll event and update the selected value.
   * @param {Object} event - The native event object that contains the information of the scroll.
   */
  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / 50);
    const newValue = days[index];
    setSelectedValue(newValue);
    onValueChange(newValue);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.scrollContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={50}
          decelerationRate="fast"
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollViewContainer}
          shouldRasterizeIOS={true}
        >
          {days.map((day, index) => (
            <View key={index} style={styles.itemContainer}>
              <Text style={styles.itemText(day === selectedValue)}>{day}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a3036',
  },
  scrollContainer: {
    flexDirection: 'row',
    position: 'relative',
    height: 45,
    width: Dimensions.get('window').width * 0.8,
  },
  scrollViewContainer: {
    paddingHorizontal: (screenWidth - 50) / 2 - 35, 
  },
  itemContainer: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: (isSelected) => ({
    fontSize: isSelected ? 26 : 20,
    color: isSelected ? '#1a3036' : '#7aabb6',
  }),
});

export default DaysPicker;
