// src/components/Profile/Profile.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Dimensions, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import JWT from 'expo-jwt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

// Define your navigation types if necessary
type RootStackParamList = {
  Profile: undefined; // Define other screens as needed
};

type ProfileScreenNavigationProp = DrawerNavigationProp<RootStackParamList, 'Profile'>;

const { width } = Dimensions.get('window');

const Profile = () => {
  const router = useRouter();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const profileImage = require('../../assets/images/default-avatar.webp'); // Default profile image
  
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [selectedCamp, setSelectedCamp] = useState<any>(null);
  const [camps, setCamps] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleMenuPress = () => {
    navigation.openDrawer(); // Open drawer on button press
  };

  const handleCampPress = (camp: any) => {
    setSelectedCamp(camp);
    // Fetch participants for the selected camp
    fetchParticipants(camp.id);
  };

  const handleAccept = (participantId: string) => {
    console.log(`Accepted: ${participantId}`);
    // Add your accept logic here
  };

  const handleReject = (participantId: string) => {
    console.log(`Rejected: ${participantId}`);
    // Add your reject logic here
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const tokenData = await AsyncStorage.getItem('token');
        if (tokenData) {
          const token = tokenData.startsWith('Bearer ') ? tokenData.replace('Bearer ', '') : tokenData;
          const key = 'mySuperSecretPrivateKey'; 

          try {
            const decodedToken = JWT.decode(token, key);
            if (decodedToken && decodedToken.id) {
              // Fetch user data based on ID from decoded token
              const response = await axios.get(`http://192.168.10.21:5000/api/users/${decodedToken.id}`);
              setUser(response.data);
              setUserData({
                id: response.data.id,
                name: response.data.name,
                email: response.data.email,
                age: response.data.age,
                location: response.data.location,
                bio: response.data.bio,
                friendsCount: response.data.friendsCount,
                campsJoined: response.data.campsJoined,
                interests: response.data.interests,
                camps: response.data.camps,
              });
            } else {
              console.error('Failed to decode token or token does not contain ID');
              setError('Failed to decode token or token does not contain ID');
            }
          } catch (decodeError) {
            console.error('Error decoding token:', decodeError);
            setError('Failed to decode token');
          }
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

    fetchUser();
  }, []);

  const fetchParticipants = async (campId: string) => {
    try {
      const response = await axios.get(`http://192.168.10.21:5000/api/camps/${campId}/participants`);
      setParticipants(response.data);
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconGroup}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="bell-outline" size={25} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="menu" size={25} color="white" onPress={handleMenuPress} />
          </TouchableOpacity>
        </View>
        <Image source={profileImage} style={styles.headerProfileImage} />
      </View>
      <View style={styles.profileSection}>
        <Text style={styles.profileName}>{userData?.name || 'User Name'}</Text>
        <View style={styles.profileInfo}>
          <MaterialCommunityIcons name="cake" size={20} color="#fff" />
          <Text style={styles.profileAge}>{userData?.age || 'N/A'} years old</Text>
        </View>
        <View style={styles.profileInfo}>
          <MaterialCommunityIcons name="map-marker" size={20} color="#fff" />
          <Text style={styles.profileLocation}>{userData?.location || 'N/A'}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileBio}>{userData?.bio || 'No bio available'}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.buttonText}>Add Camp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.buttonText}>Add Experience</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.statisticsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userData?.friendsCount || 0}</Text>
          <Text style={styles.statLabel}>Friends</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userData?.campsJoined || 0}</Text>
          <Text style={styles.statLabel}>Camps Joined</Text>
        </View>
      </View>
      <View style={styles.interestsSection}>
        <Text style={styles.sectionTitle}>Interests</Text>
        <View style={styles.tickets}>
          {userData?.interests?.map((interest: string) => (
            <View key={interest} style={styles.ticket}>
              <Text style={styles.ticketText}>{interest}</Text>
            </View>
          ))}
        </View>
        <FlatList
          data={userData?.camps || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.campCard} onPress={() => handleCampPress(item)}>
              <Text style={styles.campTitle}>{item.title}</Text>
              <Text style={styles.campDetails}>{item.location}</Text>
              <Text style={styles.campDetails}>{item.date}</Text>
            </TouchableOpacity>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.campList}
        />
      </View>
      {selectedCamp && (
        <View style={styles.campDetailsSection}>
          <Text style={styles.campDetailTitle}>{selectedCamp.title}</Text>
          <View style={styles.participantsList}>
            {participants.map((participant) => (
              <View key={participant.id} style={styles.participantCard}>
                <Image source={profileImage} style={styles.participantImage} />
                <Text style={styles.participantName}>{participant.name}</Text>
                <View style={styles.participantButtons}>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => handleAccept(participant.id)}
                  >
                    <Text style={styles.buttonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => handleReject(participant.id)}
                  >
                    <Text style={styles.buttonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00595E',
  },
  header: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#014043',
  },
  iconGroup: {
    position: 'absolute',
    right: 0,
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 10,
  },
  headerProfileImage: {
    top: 50,
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#014043',
    borderBottomWidth: 1,
    borderBottomColor: '#00595E',
  },
  profileName: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  profileAge: {
    color: 'white',
    marginLeft: 10,
  },
  profileLocation: {
    color: 'white',
    marginLeft: 10,
  },
  profileBio: {
    color: 'white',
    textAlign: 'center',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: '#0277BD',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  statisticsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#00363A',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'white',
    fontSize: 16,
  },
  interestsSection: {
    padding: 20,
    backgroundColor: '#014043',
  },
  sectionTitle: {
    fontSize: 20,
    color: 'white',
    marginBottom: 10,
  },
  tickets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ticket: {
    backgroundColor: '#0277BD',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  ticketText: {
    color: 'white',
  },
  campCard: {
    backgroundColor: '#00595E',
    padding: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  campTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  campDetails: {
    color: 'white',
  },
  campList: {
    paddingVertical: 10,
  },
  campDetailsSection: {
    padding: 20,
    backgroundColor: '#00363A',
  },
  campDetailTitle: {
    fontSize: 20,
    color: 'white',
    marginBottom: 10,
  },
  participantsList: {
    marginTop: 10,
  },
  participantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#0277BD',
    padding: 10,
    borderRadius: 5,
  },
  participantImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  participantName: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
  participantButtons: {
    flexDirection: 'row',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  rejectButton: {
    backgroundColor: '#F44336',
    padding: 5,
    borderRadius: 5,
  },
  loadingText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Profile;
