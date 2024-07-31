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

  // Track liked camps
  const [likedCamps, setLikedCamps] = useState<Set<number>>(new Set());

  const handleHeartPress = (campId: number) => {
    setLikedCamps(prevLikedCamps => {
      const newLikedCamps = new Set(prevLikedCamps);
      if (newLikedCamps.has(campId)) {
        newLikedCamps.delete(campId);
      } else {
        newLikedCamps.add(campId);
      }
      return newLikedCamps;
    });
  };

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
              const userResponse = await axios.get(`http://192.168.10.21:5000/api/users/${decodedToken.id}`);
              setUser(userResponse.data);
            } else {
              console.error('Failed to decode token or token does not contain ID');
              setError('Failed to decode token or token does not contain ID');
            }
          } catch (decodeError) {
            console.error('Error decoding token:', decodeError);
            setError('Failed to decode token');
          }

          // Fetch camps data
          const campsResponse = await axios.get('http://192.168.10.21:5000/api/camps/getAll');
          setCamps(campsResponse.data.data);
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
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity onPress={() => router.replace('/creatCamp/CreateCamPost')} style={[styles.actionButton, styles.campingPostButton]}>
            <MaterialCommunityIcons name="tent" size={24} color="white" />
            <Text style={styles.actionButtonText}>Add a Camp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.experiencesButton]}>
            <Text style={styles.actionButtonText}>Experiences</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.postList}>
        {camps.map((camp) => (
          <View style={styles.postContainer} key={camp.id}>
            <Image source={{ uri: camp.images[0] }} style={styles.postImage} />
            <TouchableOpacity
              style={styles.heartButton}
              onPress={() => handleHeartPress(camp.id)}
            >
              <MaterialCommunityIcons
                name={likedCamps.has(camp.id) ? 'heart' : 'heart-outline'}
                size={30}
                color={likedCamps.has(camp.id) ? 'red' : 'white'}
              />
            </TouchableOpacity>
            <View style={styles.postInfo}>
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
    backgroundColor: '#00595E', // Keep this color
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#014043', // Updated color
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  campSkoutText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 26, // Keep this font size
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
    paddingVertical: 10, // Adjusted padding
    paddingHorizontal: 10,
    backgroundColor: '#014043', // Updated color
    marginHorizontal: 10,
    marginVertical: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B3492D', // Updated color
    paddingVertical: 8, // Reduced vertical padding
    paddingHorizontal: 15, // Reduced horizontal padding
    borderRadius: 20, // Rounded corners
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  campingPostButton: {
    backgroundColor: '#B3492D', // Updated color
  },
  experiencesButton: {
    backgroundColor: '#B3492D', // Updated color
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14, // Reduced font size
  },
  postList: {
    padding: 20,
  },
  postContainer: {
    position: 'relative',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    height: height * 0.4,
    backgroundColor: '#014043', // Updated color
    borderColor: '#00796B', // Updated color
    borderWidth: 2,
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  postInfo: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: '#00595E',
    padding: 10,
    borderRadius: 10,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  postLocation: {
    fontSize: 14,
    color: 'white',
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  hostProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  hostName: {
    fontSize: 14,
    color: 'white',
  },
  postActions: {
    flexDirection: 'row',
    marginTop: 10,
  },
  exploreButton: {
    backgroundColor: '#B3492D', // Updated color
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 5,
  },
  exploreText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 50,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default Home;
