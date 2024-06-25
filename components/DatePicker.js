import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/AntDesign';
import moment from 'moment';

/**
 * DatePicker component allows users to select a start and end date for a trip period.
 * It uses a modal to display a calendar for date selection and shows the selected dates.
 */
class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: '',
      selectedEndDate: '',
      showModal: false,
    };
  }

  showDatePicker = () => {
    this.setState({ showModal: true });
  };

  /**
   * Hide the date picker modal and set the end date equal to the start date if only the start date was selected
   */
  hideDatePicker = () => {
    const { selectedStartDate, selectedEndDate } = this.state;

    if (selectedStartDate && !selectedEndDate) {
      this.setState({ selectedEndDate: selectedStartDate }, () => {
        const { selectedStartDate, selectedEndDate } = this.state;
        this.props.onDateChange && this.props.onDateChange(selectedStartDate, selectedEndDate);
      });
    }

    this.setState({ showModal: false });
  };

  /**
   * Handle the selection of a day in the calendar.
   * @param {Object} day - The selected day.
   */
  handleDayPress = (day) => {
    const { selectedStartDate, selectedEndDate } = this.state;

    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      this.setState({ selectedStartDate: day.dateString, selectedEndDate: '' });
    } else {
      if (selectedStartDate === day.dateString) {
        this.setState({ selectedEndDate: day.dateString }, () => {
          const { selectedStartDate, selectedEndDate } = this.state;
          this.props.onDateChange && this.props.onDateChange(selectedStartDate, selectedEndDate);
        });
      } else {
        if (moment(day.dateString).isBefore(moment(selectedStartDate))) {
          Alert.alert("Invalid Date", "The end date cannot be before the start date.");
        } else {
          this.setState({ selectedEndDate: day.dateString }, () => {
            const { selectedStartDate, selectedEndDate } = this.state;
            this.props.onDateChange && this.props.onDateChange(selectedStartDate, selectedEndDate);
          });
        }
      }
    }
  };

  /**
   * Get the marked dates for the selected period.
   * @returns {Object} - Marked dates for the calendar.
   */
  getMarkedDates = () => {
    const { selectedStartDate, selectedEndDate } = this.state;
    let markedDates = {};

    if (selectedStartDate) {
      markedDates[selectedStartDate] = { startingDay: true, color: '#50cebb', textColor: 'white' };
    }

    if (selectedEndDate) {
      markedDates[selectedEndDate] = { endingDay: true, color: '#50cebb', textColor: 'white' };

      let currentDate = moment(selectedStartDate).add(1, 'days');
      while (currentDate.format('YYYY-MM-DD') !== selectedEndDate && currentDate.isBefore(selectedEndDate)) {
        markedDates[currentDate.format('YYYY-MM-DD')] = { color: '#70d7c7', textColor: 'white' };
        currentDate = currentDate.add(1, 'days');
      }
    }

    return markedDates;
  };

  render() {
    const { selectedStartDate, selectedEndDate, showModal } = this.state;
    const displayDate = selectedStartDate && selectedEndDate
      ? `From ${moment(selectedStartDate).format('MMM D, YYYY')} to ${moment(selectedEndDate).format('MMM D, YYYY')}`
      : 'Select...';
    const today = moment().format('YYYY-MM-DD');

    return (
      <View style={styles.container}>
        <Text style={styles.label}>Trip Period:</Text>
        <TouchableOpacity style={styles.inputContainer} onPress={this.showDatePicker}>
          <Text style={styles.inputText}>{displayDate}</Text>
          <Icon name="down-square-o" size={24} color="#297687" />
        </TouchableOpacity>
        <Modal visible={showModal} animationType="slide" transparent>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Calendar
                minDate={today}
                onDayPress={this.handleDayPress}
                markingType={'period'}
                markedDates={this.getMarkedDates()}
                theme={{
                  calendarBackground: '#F5F9F6',
                  textSectionTitleColor: '#b6c1cd',
                  selectedDayTextColor: '#ffffff',
                  todayTextColor: '#297687',
                  dayTextColor: '#2d4150',
                  textDisabledColor: '#d9e1e8',
                  monthTextColor: '#297687',
                  indicatorColor: '#50cebb',
                  arrowColor: '#297687',
                  textDayFontFamily: 'monospace',
                  textMonthFontFamily: 'monospace',
                  textDayHeaderFontFamily: 'monospace',
                  textDayFontWeight: '300',
                  textMonthFontWeight: 'bold',
                  textDayHeaderFontWeight: '300',
                  textDayFontSize: 16,
                  textMonthFontSize: 16,
                  textDayHeaderFontSize: 16,
                }}
              />
              <TouchableOpacity onPress={this.hideDatePicker} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    width: '100%',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a3036',
  },
  inputContainer: {
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
  inputText: {
    color: '#1a3036',
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#F5F9F6',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#297687',
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default DatePicker;
