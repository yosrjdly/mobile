import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Dimensions, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter , useNavigation } from 'expo-router';

const { width } = Dimensions.get('window');

const Profile = () => {
  const router = useRouter();
  const navigation = useNavigation()

  const profileImage = require('../../assets/images/default-avatar.webp');
  
  // Dummy data for demonstration
  const userAge = 28;
  const userLocation = 'New York, USA';
  const userBio = 'Outdoor enthusiast, love hiking and camping. Always up for an adventure!';
  const friendsCount = 120;
  const campsJoined = 15;

  const handleMenuPress = () => {
    navigation.openDrawer(); // Open drawer on button press
  };

  const interests = ['Hiking', 'Camping', 'Fishing'];
  const campOffers = [
    { id: '1', title: 'Mountain Adventure', location: 'Rocky Mountains', date: '2024-08-01' },
    { id: '2', title: 'Beach Camping', location: 'Santa Monica Beach', date: '2024-08-15' },
    { id: '3', title: 'Forest Expedition', location: 'Amazon Rainforest', date: '2024-09-10' },
  ];

  const participants = [
    { id: '1', name: 'Alice', image: profileImage },
    { id: '2', name: 'Bob', image: profileImage },
    { id: '3', name: 'Charlie', image: profileImage },
  ];

  const [selectedCamp, setSelectedCamp] = useState(null);

  const handleCampPress = (camp) => {
    setSelectedCamp(camp);
  };

  const handleAccept = (participantId) => {
    console.log(`Accepted: ${participantId}`);
    // Add your accept logic here
  };

  const handleReject = (participantId) => {
    console.log(`Rejected: ${participantId}`);
    // Add your reject logic here
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconGroup}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="bell-outline" size={25} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="menu" size={25} color="white" onPress={ handleMenuPress} />
          </TouchableOpacity>
        </View>
        <Image source={profileImage} style={styles.headerProfileImage} />
      </View>
      <View style={styles.profileSection}>
        <Text style={styles.profileName}>John Doe</Text>
        <View style={styles.profileInfo}>
          <MaterialCommunityIcons name="cake" size={20} color="#fff" />
          <Text style={styles.profileAge}>{userAge} years old</Text>
        </View>
        <View style={styles.profileInfo}>
          <MaterialCommunityIcons name="map-marker" size={20} color="#fff" />
          <Text style={styles.profileLocation}>{userLocation}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileBio}>{userBio}</Text>
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
          <Text style={styles.statNumber}>{friendsCount}</Text>
          <Text style={styles.statLabel}>Friends</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{campsJoined}</Text>
          <Text style={styles.statLabel}>Camps Joined</Text>
        </View>
      </View>
      <View style={styles.interestsSection}>
        <Text style={styles.sectionTitle}>Interests</Text>
        <View style={styles.tickets}>
          {interests.map((interest) => (
            <View key={interest} style={styles.ticket}>
              <Text style={styles.ticketText}>{interest}</Text>
            </View>
          ))}
        </View>
        <FlatList
          data={campOffers}
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
                <Image source={participant.image} style={styles.participantImage} />
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
    paddingBottom: 20, // Add padding to separate from statistics section
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
    width: width, // Full width of the screen
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
});

export default Profile;
