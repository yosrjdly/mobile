import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import * as Animatable from 'react-native-animatable';
import { useRouter } from 'expo-router';

const Welcome = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Animatable.View 
        animation="bounceInDown"
        duration={1500}
        style={styles.imageWrapper}
      >
        <Image 
          source={require('../assets/images/campDetails.png')} 
          style={styles.image}
        />
      </Animatable.View>
      <Animatable.View 
        animation="fadeInUp"
        duration={2000}
        delay={500}
        style={styles.textWrapper}
      >
        <Text style={styles.welcomeText}>
          Welcome to CampScout!
        </Text>
        <Text style={styles.descriptionText}>
          A whole community of campers awaits—organize trips and make new friends!
        </Text>
      </Animatable.View>
      <Animatable.View 
        animation="bounceIn"
        duration={2000}
        delay={1000}
        style={styles.buttonWrapper}
      >
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push("auth/SignIn")}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Let's Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.homeButton]} 
          onPress={() => router.push("/home")} // Ensure correct path
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00595E',
  },
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  image: {
    width: 220,
    height: 485,
    borderRadius: 20,
    borderWidth: 6,
    borderColor: 'black',
  },
  textWrapper: {
    alignItems: 'center',
    backgroundColor: 'rgba(7, 52, 54, 0.8)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#B3492D',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  homeButton: {
    backgroundColor: '#014043', // Different color for the Home button
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
