import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

/**
 * SubmitButton component renders a button that displays a loading state
 * when an operation is in progress.
 * @param {function} onPress - The function to call when the button is pressed.
 * @param {boolean} isLoading - Boolean indicating if the button should show a loading state.
 */
const SubmitButton = ({ onPress, isLoading }) => {
  return (
    <Button  style={styles.button} onPress={onPress} disabled={isLoading}>
      <Text style={styles.buttonText}>{isLoading ? 'Loading...' : 'Submit'}</Text>
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginVertical: 5,
    backgroundColor: '#297687',
    marginBottom: 40,
    height: 50,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default SubmitButton;
