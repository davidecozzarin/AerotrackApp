import React from "react";
import { View, Text, StyleSheet, } from 'react-native';

/**
 * Heading component that displays the title of the application.
 */
const Heading = () => (
    <View style={styles.header}>
        <Text style= {styles.headerText}>
            AEROTRACK
        </Text>
    </View>
)

const styles = StyleSheet.create({
    header: {
        marginTop: 75,
    },
    headerText: {
    textAlign: 'center',
    fontSize: 50, 
    color: '#1a3036',
    fontWeight: 'bold',
    },  
})

export default Heading

