// AboutUs.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import Logo from "../../assets/images/Logo.png"; 
import { useRouter, router } from 'expo-router';
const AboutUs = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() =>router.replace("home") }>
        <Icon name="arrow-back" size={30} color="#fff" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>About Us</Text>
        <Text style={styles.description}>
          CampSkout is dedicated to providing you with the best outdoor camping experiences. Our platform connects outdoor enthusiasts with a variety of campsites, making it easier for you to find and book your next adventure. Our team is passionate about the outdoors and strives to create memorable experiences for all our users.
        </Text>
        <Text style={styles.subtitle}>Our Mission</Text>
        <Text style={styles.description}>
          Our mission is to make outdoor camping accessible and enjoyable for everyone. We believe in promoting a healthy, adventurous lifestyle and providing a platform where campers can connect with nature and each other.
        </Text>
        <Text style={styles.subtitle}>Contact Us</Text>
        <Text style={styles.description}>
          If you have any questions or need support, feel free to contact us at support@campskout.com.
        </Text>
        <View style={styles.logoContainer}>
          <Image source={Logo} style={styles.logo} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#014043',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  title: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
    marginLeft:95
  },
  subtitle: {
    fontSize: 20,
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    marginLeft:95
  },
  description: {
    fontSize: 16,
    color: '#ddd',
    lineHeight: 24,
  },
  logoContainer: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#014043', // Matches the container background color
  },
  logo: {
    width: 150, // Adjust the width as needed
    height: 150, // Adjust the height as needed
    resizeMode: 'contain', // Ensures the logo scales correctly
  },
  backButton: {
    position: 'absolute',
    top: 25,
    left: 20,
    zIndex: 1,
  },
});

export default AboutUs;
