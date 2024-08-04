import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const Tutoriels = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tutoriels</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00595E',
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  text: {
    color: '#FFFFFF', 
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Tutoriels;
