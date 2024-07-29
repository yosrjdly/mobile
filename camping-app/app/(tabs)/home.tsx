// src/components/Home/Home.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JWT from 'expo-jwt';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const Home = () => {
  const router = useRouter();
  const profileImage = require('../../assets/images/default-avatar.webp');
  const [user, setUser] = useState<any>(null);
  const [camps, setCamps] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndCamps = async () => {
      try {
        const tokenData = await AsyncStorage.getItem('token');
        if (tokenData) {
          const token = tokenData.startsWith('Bearer ') ? tokenData.replace('Bearer ', '') : tokenData;
          const key = 'mySuperSecretPrivateKey'; // Ensure this matches the encoding key

          try {
            const decodedToken = JWT.decode(token, key);
            if (decodedToken && decodedToken.id) {
              // Fetch user data based on ID from decoded token
              const userResponse = await axios.get(`http://192.168.10.9:5000/api/users/${decodedToken.id}`);
              setUser(userResponse.data);
              console.log('Fetched user:', userResponse.data);
            } else {
              console.error('Failed to decode token or token does not contain ID');
              setError('Failed to decode token or token does not contain ID');
            }
          } catch (decodeError) {
            console.error('Error decoding token:', decodeError);
            setError('Failed to decode token');
          }

          // Fetch camps data
          const campsResponse = await axios.get('http://192.168.10.9:5000/api/camps/getAll');
          setCamps(campsResponse.data.data);
          console.log('Fetched camps:', campsResponse.data.data);
        } else {
          console.error('Token not found in AsyncStorage');
          setError('Token not found');
        }
      } catch (storageError) {
        console.error('Failed to fetch token from AsyncStorage:', storageError);
        setError('Failed to fetch token');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndCamps();
  }, []); // Empty dependency array to run only once

  console.log('User:', user);
  console.log('Camps12:', camps);

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.campSkoutText}>CampSkout</Text>
        <View style={styles.iconGroup}>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="search" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="medical-bag" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="menu" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.actionSection}>
        <TouchableOpacity onPress={() => router.replace('/profile/Profile')}>
          <Image source={profileImage} style={styles.profileImage} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/creatCamp/CreateCamPost')} style={[styles.actionButton, styles.campingPostButton]}>
          <MaterialCommunityIcons name="tent" size={24} color="white" />
          <Text style={styles.actionButtonText}>Add a Camp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.experiencesButton]}>
          <Feather name="book" size={24} color="white" />
          <Text style={styles.actionButtonText}>Experiences</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.postList}>
        {camps.map((camp) => (
          <View style={styles.postContainer} key={camp.id}>
            <Image source={{ uri: camp.images[0] }} style={styles.postImage} />
            <View style={styles.overlay} />
            <View style={styles.postInfo}>
              <TouchableOpacity style={styles.heartButton}>
                <MaterialCommunityIcons name="heart-outline" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.postTitle}>{camp.title}</Text>
              <Text style={styles.postLocation}>
                <MaterialCommunityIcons name="map-marker-outline" size={18} color="#fff" /> {camp.location}
              </Text>
              {camp.user && (
                <View style={styles.hostInfo}>
                  <Image source={{ uri: camp.user.imagesProfile[0] || profileImage }} style={styles.hostProfileImage} />
                  <Text style={styles.hostName}>{camp.user.name}</Text>
                </View>
              )}
              <View style={styles.postActions}>
                <TouchableOpacity onPress={() => router.push(`/${camp.id}`)} style={styles.exploreButton}>
                  <Text style={styles.exploreText}>Explore</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00595E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#014043',
  },
  campSkoutText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 24,
  },
  iconGroup: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 15,
  },
  actionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#014043',
    marginHorizontal: 10,
    marginVertical: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B3492D',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    flex: 1,
    justifyContent: 'center',
  },
  campingPostButton: {
    marginRight: 10,
  },
  experiencesButton: {
    marginLeft: 10,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 10,
  },
  postList: {
    padding: 20,
  },
  postContainer: {
    position: 'relative',
    backgroundColor: 'transparent',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    height: height * 0.4, // Adjust the height as needed
  },
  postImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Add an overlay to make text readable
  },
  postInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'rgba(0, 89, 94, 0.6)', // Darker background to ensure text readability
  },
  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center',
  },
  postLocation: {
    color: '#fff',
    marginBottom: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  hostProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  hostName: {
    color: '#fff',
    fontWeight: 'bold',
  },
  postActions: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  exploreButton: {
    backgroundColor: '#B3492D',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  exploreText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    color: '#fff',
  },
  errorText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    color: 'red',
  },
});

export default Home;