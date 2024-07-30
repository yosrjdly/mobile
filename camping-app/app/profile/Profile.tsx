// src/components/Profile/Profile.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Dimensions, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useNavigation } from 'expo-router';
import JWT from 'expo-jwt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width } = Dimensions.get('window');

const Profile = () => {
  const router = useRouter();
  const navigation = useNavigation();
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
          const key = 'mySuperSecretPrivateKey'; // Ensure this matches the encoding key

          try {
            const decodedToken = JWT.decode(token, key);
            if (decodedToken && decodedToken.id) {
              // Fetch user data based on ID from decoded token
              const response = await axios.get(` http://192.168.10.21:5000/api/users/${decodedToken.id}`);
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

  const fetchParticipants = async (campId) => {
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
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileSection: {
    top: 50,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
    paddingBottom: 20,
  },
  profileName: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileAge: {
    fontSize: 12,
    color: '#fff',
    marginLeft: 10,
  },
  profileLocation: {
    fontSize: 12,
    color: '#fff',
    marginLeft: 10,
  },
  profileBio: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  actionButton: {
    backgroundColor: '#B3492D',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  statisticsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width,
    marginTop: 20,
    backgroundColor: '#014043',
    paddingVertical: 20,
    borderRadius: 0,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
  },
  interestsSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tickets: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  ticket: {
    backgroundColor: '#014043',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  ticketText: {
    color: '#fff',
    fontSize: 14,
  },
  campList: {
    paddingVertical: 10,
  },
  campCard: {
    backgroundColor: '#014043',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    width: 200,
  },
  campTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  campDetails: {
    fontSize: 12,
    color: '#fff',
  },
  campDetailsSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  campDetailTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  participantsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  participantCard: {
    backgroundColor: '#014043',
    padding: 10,
    borderRadius: 5,
    width: '48%',
    marginBottom: 10,
    alignItems: 'center',
  },
  participantImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  participantName: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  participantButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  rejectButton: {
    backgroundColor: '#F44336',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
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

export default Profile;
