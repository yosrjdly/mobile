// src/components/Profile/Profile.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Dimensions, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JWT from 'expo-jwt';

const { width } = Dimensions.get('window');

const Profile = () => {
  const profileImage = require('../../assets/images/default-avatar.webp'); // Default profile image

  const [userData, setUserData] = useState<any>(null);
  const [selectedCamp, setSelectedCamp] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleCampPress = (camp: any) => {
    setSelectedCamp(camp);
    fetchParticipants(camp.id);
  };

  const handleAccept = async (participantId: string) => {
    try {
      const response = await axios.post(`http://192.168.10.9:5000/api/acceptAndReject/${participantId}/accept`);
      console.log(`Accepted: ${participantId}`, response.data);
      fetchParticipants(selectedCamp.id);
    } catch (error) {
      console.error('Error accepting participant:', error);
    }
  };

  const handleReject = async (participantId: string) => {
    try {
      const response = await axios.post(`http://192.168.10.9:5000/api/acceptAndReject/${participantId}/reject`);
      console.log(`Rejected: ${participantId}`, response.data);
      fetchParticipants(selectedCamp.id);
    } catch (error) {
      console.error('Error rejecting participant:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async (userId: string) => {
      try {
        const response = await axios.get(`http://192.168.10.9:5000/api/users/${userId}`);
        console.log('posts organized',response.data.posts);
        setUserData({
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          age: response.data.user.age,
          location: response.data.user.location,
          bio: response.data.user.bio,
          friendsCount: response.data.user.friendsCount,
          joinedUsers: response.data.posts,
          interests: response.data.user.interests,
          posts: response.data.posts
          ,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    const decodeToken = async () => {
      try {
        const tokenData = await AsyncStorage.getItem('token');
        if (tokenData) {
          const token = tokenData.startsWith('Bearer ') ? tokenData.replace('Bearer ', '') : tokenData;
          const key = 'mySuperSecretPrivateKey'; // Ensure this matches the encoding key

          try {
            const decodedToken = JWT.decode(token, key);
            if (decodedToken && decodedToken.id) {
              fetchUserData(decodedToken.id);
            } else {
              console.error('Failed to decode token or token does not contain ID');
              setError('Failed to decode token or token does not contain ID');
              setLoading(false);
            }
          } catch (decodeError) {
            console.error('Error decoding token:', decodeError);
            setError('Failed to decode token');
            setLoading(false);
          }
        } else {
          console.error('Token not found in AsyncStorage');
          setError('Token not found');
          setLoading(false);
        }
      } catch (storageError) {
        console.error('Failed to fetch token from AsyncStorage:', storageError);
        setError('Failed to fetch token');
        setLoading(false);
      }
    };

    decodeToken();
  }, []);

  const fetchParticipants = async (campId: string) => {
    try {
      const response = await axios.get(`http://192.168.10.9:5000/api/camps/${campId}`);
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
console.log('userdata',userData)
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconGroup}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="bell-outline" size={25} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="menu" size={25} color="white" />
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
          data={userData?.posts || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.campCard} onPress={() => handleCampPress(item)}>
              <Text style={styles.campTitle}>{item.post.title}</Text>
              <Text style={styles.campDetails}>{item.post.location}</Text>
              <Text style={styles.campDetails}>{item.post.date}</Text>
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
            {userData.joinedUsers.map((participant:any) => (
              
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
  headerProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  iconGroup: {
    position: 'absolute',
    right: 20,
    flexDirection: 'row',
  },
  iconButton: {
    marginHorizontal: 5,
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileName: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  profileAge: {
    color: '#fff',
    marginLeft: 5,
  },
  profileLocation: {
    color: '#fff',
    marginLeft: 5,
  },
  profileBio: {
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  actionButton: {
    backgroundColor: '#0D9B9E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statisticsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#0D9B9E',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#fff',
    marginTop: 5,
  },
  interestsSection: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tickets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ticket: {
    backgroundColor: '#0D9B9E',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 5,
  },
  ticketText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  campList: {
    paddingLeft: 10,
    paddingRight: 20,
  },
  campCard: {
    backgroundColor: '#014043',
    borderRadius: 10,
    padding: 20,
    marginRight: 10,
  },
  campTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  campDetails: {
    color: '#fff',
    marginBottom: 5,
  },
  campDetailsSection: {
    padding: 20,
  },
  campDetailTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  participantsList: {
    marginTop: 10,
  },
  participantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  participantImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  participantName: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
  },
  participantButtons: {
    flexDirection: 'row',
  },
  acceptButton: {
    backgroundColor: '#0D9B9E',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  rejectButton: {
    backgroundColor: '#B33A3A',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
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
    color: '#B33A3A',
  },
});

export default Profile;
