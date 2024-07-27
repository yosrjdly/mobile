import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const Interests = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Animated.Text style={[styles.title, { transform: [{ translateY: slideAnim }] }]}>Tell us</Animated.Text>
      <Animated.Text style={[styles.title, { transform: [{ translateY: slideAnim }] }]}>What you love</Animated.Text>
      <Animated.Text style={[styles.subtitle, { transform: [{ translateY: slideAnim }] }]}>
        So we can show you what you like. Come back and change this whenever.
      </Animated.Text>
      <View style={styles.interestContainer}>
        <TouchableOpacity style={[styles.interestBtn]}>
          <View style={styles.iconContainer}>
            <Image 
              source={{ uri: 'https://cdn.dribbble.com/users/589499/screenshots/3583371/hikeman_01_4x3.gif' }} 
              style={styles.interestIcon} 
              resizeMode="cover" 
            />
          </View>
          <Text style={styles.interestText}>Hitchhiking</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.interestBtn]}>
          <View style={styles.iconContainer}>
            <Image 
              source={{ uri: 'https://cdn.dribbble.com/users/230073/screenshots/3780396/kayak8.gif' }} 
              style={styles.interestIcon} 
              resizeMode="cover" 
            />
          </View>
          <Text style={styles.interestText}>Kayaking</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.interestBtn]}>
          <View style={styles.iconContainer}>
            <Image 
              source={{ uri: 'https://i.pinimg.com/originals/f8/80/28/f88028821915496a4fa2622a6f89e658.gif' }} 
              style={styles.interestIcon} 
              resizeMode="cover" 
            />
          </View>
          <Text style={styles.interestText}>Climbing</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.interestContainer}>
        <TouchableOpacity style={[styles.interestBtn]}>
          <View style={styles.iconContainer}>
            <Image 
              source={{ uri: 'https://cdn.dribbble.com/users/422998/screenshots/1282571/dribbblegif.gif' }} 
              style={styles.interestIcon} 
              resizeMode="cover" 
            />
          </View>
          <Text style={styles.interestText}>Hiking</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.interestBtn]}>
          <View style={styles.iconContainer}>
            <Image 
              source={{ uri: 'https://cdn.dribbble.com/users/3683190/screenshots/8631389/media/3862fb67eead2fc355e2351441d87b19.gif' }} 
              style={styles.interestIcon} 
              resizeMode="cover" 
            />
          </View>
          <Text style={styles.interestText}>Fishing</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.interestBtn]}>
          <View style={styles.iconContainer}>
            <Image 
              source={{ uri: 'https://data.textstudio.com/output/sample/animated/8/4/5/5/other-1-5548.gif' }} 
              style={styles.interestIcon} 
              resizeMode="cover" 
            />
          </View>
          <Text style={styles.interestText}>Other</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.doneBtn}>
        <Text style={styles.doneText}>Done</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.skipBtn}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default Interests;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00595E',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#E0F7FA',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#B2EBF2',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  interestContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: width - 40,
    marginBottom: 20,
  },
  interestBtn: {
    width: '30%',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    margin: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  interestIcon: {
    width: '100%',
    height: '100%',
  },
  interestText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  doneBtn: {
    backgroundColor: '#B3492D',
    padding: 15,
    borderRadius: 8,
    width: '90%',
    marginBottom: 20,
    shadowColor: '#004d40',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  doneText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  skipBtn: {
    backgroundColor: '#004d40',
    padding: 15,
    borderRadius: 8,
    width: '90%',
    shadowColor: '#004d40',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  skipText: {
    color: '#E0F7FA',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
