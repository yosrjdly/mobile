import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JWT from 'expo-jwt';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const categories = ['Kayaking', 'Climbing', 'Fishing', 'Hiking', 'Hitchhiking'];

const Home = () => {
  const router = useRouter();
  const profileImage = require('../../assets/images/default-avatar.webp');
  const [user, setUser] = useState<any>(null);
  const [camps, setCamps] = useState<any[]>([]);
  const [filteredCamps, setFilteredCamps] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredCamps(camps);
    } else {
      setFilteredCamps(camps.filter(camp => camp.category === category));
    }
  };

  useEffect(() => {
    const fetchUserAndCamps = async () => {
      try {
        const tokenData = await AsyncStorage.getItem('token');
        console.log("token:",tokenData)

        if (tokenData) {
          const token = tokenData.startsWith('Bearer ') ? tokenData.replace('Bearer ', '') : tokenData;
          const key = 'mySuperSecretPrivateKey'; // Ensure this matches the encoding key

          try {
            const decodedToken = JWT.decode(token, key);
            console.log("decoded token:",decodedToken)
            if (decodedToken && decodedToken.id) {


              // Fetch user data based on ID from decoded token
            console.log("decoded token id:",decodedToken.id)

              const userResponse = await axios.get(`http://192.168.10.6:5000/api/users/${decodedToken.id}`);

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
          const campsResponse = await axios.get('http://192.168.10.6:5000/api/camps/getAll');
          console.log(campsResponse.data.data[0].user.imagesProfile[0]);
          
          setCamps(campsResponse.data.data);
          setFilteredCamps(campsResponse.data.data);
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
          <TouchableOpacity style={styles.iconButton}  onPress={() =>router.push('emergenci')} >
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
        <TouchableOpacity onPress={() =>router.push('/creatCamp/CreateCamPost')} style={[styles.actionButton, styles.campingPostButton]} >
          <Text style={styles.actionButtonText}>Add a Camp</Text>
        </TouchableOpacity>
        <TouchableOpacity  style={[styles.actionButton, styles.experiencesButton]}>
          <Text style={styles.actionButtonText}>Experiences</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.categorySection}>
        {['All', ...categories].map(category => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, selectedCategory === category && styles.selectedCategoryButton]}
            onPress={() => handleCategoryChange(category)}
          >
            <Text style={styles.categoryButtonText}>{category}</Text>

          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.postList}>
        {filteredCamps.map((camp) => (
          <View style={styles.postContainer} key={camp.id}>
            <Image source={{ uri: camp.images[0] }} style={styles.postImage} />
            <View style={styles.postOverlay}>
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
              <View style={styles.textOverlay}>
                <Text style={styles.postTitle}>{camp.title}</Text>
                <Text style={styles.postLocation}>
                  <MaterialCommunityIcons name="map-marker-outline" size={18} color="#fff" /> {camp.location}
                </Text>
                <Text style={styles.postCategory}>
                  <MaterialCommunityIcons name="tag-outline" size={18} color="#fff" /> {camp.category}
                </Text>
                {camp.user && (
                  <View style={styles.hostInfo}>
                    {/* <Image source={{ uri: camp.user.imagesProfile[0] || profileImage }} style={styles.hostProfileImage} /> */}
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
    fontSize: 26,
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#014043',
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
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 5,
  },
  campingPostButton: {
    backgroundColor: '#B3492D',
  },
  experiencesButton: {
    backgroundColor: '#B3492D',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  categorySection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 10,
  },
  categoryButton: {
    backgroundColor: '#00595E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    margin: 5,
  },
  selectedCategoryButton: {
    backgroundColor: '#004d4d',
  },
  categoryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  postList: {
    paddingHorizontal: 10,
  },
  postContainer: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    height: height * 0.4,
    backgroundColor: '#014043', // Updated color
    borderColor: '#00796B', // Updated color
    borderWidth: 2,
  },
  postImage: {
    width: width - 20,
    height: 200,
  },
  postOverlay: {
    position: 'relative',
    height: 100,
  },
  textOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: '#00595E',
    padding: 10,
    borderTopLeftRadius: 15,
  },
  postTitle: {
    fontWeight: 'bold',
  
  },
  postLocation: {
    fontSize: 14,
    color: 'white',
    fontSize: 14,
    marginVertical: 2,
  },
  postCategory: {
    color: 'white',
    fontSize: 14,
    marginVertical: 2,
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
    justifyContent: 'center',
  },
  exploreButton: {
    backgroundColor: '#B3492D',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginVertical: 10,
  },
  exploreText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1, // Ensure it appears above other elements
  },
  loadingText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    textAlign: 'center',
    marginTop: 50,
  },
  errorText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default Home;
