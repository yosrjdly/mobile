import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JWT from 'expo-jwt';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const categories = ['Kayaking', 'Climbing', 'Fishing', 'Hiking', 'Hitchhiking'];


interface User {

  id: string;
  name: string;
  email: string;
  role: string;
  imagesProfile?: string[]; 
}

const Home = () => {
  const router = useRouter();
  const profileImage = require('../../assets/images/default-avatar.webp');
  const [user, setUser] = useState<User>({ id: "", name: "", email: "", role: "", imagesProfile: [] });
  const [camps, setCamps] = useState<any[]>([]);
  const [filteredCamps, setFilteredCamps] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [likedCamps, setLikedCamps] = useState<Set<number>>(new Set());
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const menuAnimation = useState(new Animated.Value(-width))[0]; 

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredCamps(camps);
    } else {
      setFilteredCamps(camps.filter(camp => camp.category === category));
    }
  };

  const toggleMenu = () => {
    setMenuVisible(prev => !prev);
    Animated.timing(menuAnimation, {
      toValue: menuVisible ? -width : 0, 
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('auth/SignIn'); 
  };

  const handleCloseMenu = () => {
    setMenuVisible(false);
    Animated.timing(menuAnimation, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    const fetchUserAndCamps = async () => {
      try {
        // Retrieve user data from AsyncStorage
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // If no user data, fetch token and decode
          const tokenData = await AsyncStorage.getItem('token');
          if (tokenData) {
            const token = tokenData.startsWith('Bearer ') ? tokenData.replace('Bearer ', '') : tokenData;
            const key = 'mySuperSecretPrivateKey';

            try {
              const decodedToken = JWT.decode(token, key);
              if (decodedToken) {
                const userData: User = {
                  id: decodedToken.id || '',
                  name: decodedToken.name || '',
                  email: decodedToken.email || '',
                  imagesProfile: decodedToken.imagesProfile,
                  role: decodedToken.role || '',
                };

                // Save user data to AsyncStorage
                await AsyncStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
              } else {
                console.error('Failed to decode token');
              }
            } catch (decodeError) {
              console.error('Error decoding token:', decodeError);
            }
          } else {
            console.error('Token not found in AsyncStorage');
            setError('Token not found');
          }
        }

        // Fetch camps data
        const campsResponse = await axios.get('http://192.168.10.4:5000/api/camps/getAll');
        setCamps(campsResponse.data.data);
        setFilteredCamps(campsResponse.data.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndCamps();
  }, []);


  // console.log('User:', user);
  // console.log('Camps:', camps);

  const handleHeartPress = (campId: number) => {
    console.log(`Heart pressed for campId: ${campId}`); 
    setLikedCamps(prevLikedCamps => {
      const newLikedCamps = new Set(prevLikedCamps);
      if (newLikedCamps.has(campId)) {
        newLikedCamps.delete(campId);
        console.log(`Removed campId: ${campId} from likedCamps`); 
      } else {
        newLikedCamps.add(campId); // Add to liked camps
        console.log(`Added campId: ${campId} to likedCamps`); 
      }
      return newLikedCamps;
    });
  };

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.campSkoutText}>CampSkout</Text>
          <View style={styles.iconGroup}>
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="search" size={24} color="white" onPress={() =>router.replace('search/SearchByName')} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialCommunityIcons name="medical-bag" size={24} color="white" onPress={() =>router.replace('emergenci/emergenci')} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={toggleMenu}>
              <MaterialCommunityIcons name="menu" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.actionSection}>
          <TouchableOpacity onPress={() => router.replace('/profile/Profile')}>
            <Image source={{ uri: user.imagesProfile?.[0] || 'https://via.placeholder.com/50' }} style={styles.profileImage} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.campingPostButton]} onPress={() => router.replace('creatCamp/CreateCamPost')}>
            <Text style={styles.actionButtonText}>Add a Camp</Text>
            
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.experiencesButton]} onPress={() => router.replace('experience/experience')}>
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
            </View>
          ))}
        </View>
      </ScrollView>
      <Animated.View style={[styles.menu, { transform: [{ translateX: menuAnimation }] }]}>
        <TouchableOpacity style={styles.closeButton} onPress={handleCloseMenu}>
          <Feather name="x" size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.menuItems}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/profile/Profile')}>
            <MaterialCommunityIcons name="account" size={24} color="white" />
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/profile/MyCamps')}>
            <MaterialCommunityIcons name="campfire" size={24} color="white" />
            <Text style={styles.menuText}>My Camps</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/favorites')}>
            <MaterialCommunityIcons name="heart" size={24} color="white" />
            <Text style={styles.menuText}>Favorites</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/aboutUs/AboutUs')}>
            <MaterialCommunityIcons name="information-outline" size={24} color="white" />
            <Text style={styles.menuText}>About Us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={24} color="white" />
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#014043',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#014043',
  },
  campSkoutText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
  iconGroup: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 10,
  },
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  actionButton: {
    backgroundColor: '#1e90ff',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    height:50,
    width:100,
    marginTop:10
  },
  campingPostButton: {
    backgroundColor: '#B3492D',
  },
  experiencesButton: {
    backgroundColor: '#B3492D',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  categorySection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  categoryButton: {
    backgroundColor: '#202d29',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  selectedCategoryButton: {
    backgroundColor: '#00595E',
  },
  categoryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  postList: {
    paddingVertical: 10,
  },
  postContainer: {
    marginBottom: 20,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  postOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    padding: 10,
  },
  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: 10,
    zIndex: 1,
  },
  
  
  textOverlay: {
    marginBottom: 10,
  },
  postTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  postLocation: {
    color: '#fff',
    fontSize: 14,
  },
  postCategory: {
    color: '#fff',
    fontSize: 14,
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
    marginRight: 5,
  },
  hostName: {
    color: '#fff',
  },
  postActions: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exploreButton: {
    backgroundColor: '#B3492D',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  exploreText: {
    color: '#fff',
  },
  menu: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width * 0.75,
    height: height,
    backgroundColor: '#00595E',
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  menuItems: {
    marginTop: 50,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  menuText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
  loadingText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Home;