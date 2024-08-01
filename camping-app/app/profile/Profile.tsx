
// src/components/Profile/Profile.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Dimensions, FlatList,ActivityIndicator, } from 'react-native';
import { MaterialCommunityIcons , FontAwesome} from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import JWT from 'expo-jwt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import SharedExp from '../../components/SharedExp';

// Define your navigation types if necessary
type RootStackParamList = {
  Profile: undefined; // Define other screens as needed
};

type ProfileScreenNavigationProp = DrawerNavigationProp<RootStackParamList, 'Profile'>;


const { width } = Dimensions.get("window");

const Profile = () => {

  const router = useRouter();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const profileImage = require('../../assets/images/default-avatar.webp'); // Default profile image
  const [user, setUser] = useState<any>(null);


  const [userData, setUserData] = useState<any>(null);
  const [selectedCamp, setSelectedCamp] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleCampPress = (camp: any) => {
    setSelectedCamp(camp);
    fetchParticipants(camp.id);
  };

  const handleAccept = async (userId, postId) => {
    try {
      const response = await axios.post(
        `http://192.168.10.20:5000/api/acceptAndReject/${userId}/${postId}`
      );
      console.log(`Accepted: ${userId}`, response.data);
      setParticipants((prevParticipants) =>
        prevParticipants.map((participant) =>
          participant.userId === userId && participant.postId === postId
            ? { ...participant, status: "accepted" }
            : participant
        )
      );
    } catch (error) {
      console.error("Error accepting participant:", error);
    }
  };

  const handleReject = async (userId, postId) => {
    try {
      const response = await axios.post(
        `http://192.168.10.20:5000/api/acceptAndReject/reject/${userId}/${postId}`
      );
      console.log(`Rejected: ${userId}`, response.data);
      setParticipants((prevParticipants) =>
        prevParticipants.map((participant) =>
          participant.userId === userId && participant.postId === postId
            ? { ...participant, status: "rejected" }
            : participant
        )
      );
    } catch (error) {
      console.error("Error rejecting participant:", error);
    }
  };
  useEffect(() => {
    const fetchUserData = async (userId: string) => {
      try {
        const response = await axios.get(
          `http://192.168.10.20:5000/api/users/${userId}`
        );
        console.log("User data fetched:", response.data);
        setUserData({
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          age: response.data.user.age,
          imagesProfile:response.data.user.imagesProfile,
          location: response.data.user.location,
          bio: response.data.user.bio,
          friendsCount: response.data.user.friendsCount,
          joinedUsers: response.data.posts,
          interests: response.data.user.interests,
          posts: response.data.posts,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    const decodeToken = async () => {
      try {
        const tokenData = await AsyncStorage.getItem("token");
        if (tokenData) {
          const token = tokenData.startsWith('Bearer ') ? tokenData.replace('Bearer ', '') : tokenData;
          const key = 'mySuperSecretPrivateKey';

          try {
            const decodedToken = JWT.decode(token, key);
            if (decodedToken && decodedToken.id) {

              // Fetch user data based on ID from decoded token
              const response = await axios.get(`http://192.168.10.20:5000/api/users/${decodedToken.id}`);
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

              fetchUserData(decodedToken.id);
            } else {
              console.error(
                "Failed to decode token or token does not contain ID"
              );
              setError("Failed to decode token or token does not contain ID");
              setLoading(false);
            }
          } catch (decodeError) {
            console.error("Error decoding token:", decodeError);
            setError("Failed to decode token");
            setLoading(false);
          }
        } else {
          console.error("Token not found in AsyncStorage");
          setError("Token not found");
          setLoading(false);
        }
      } catch (storageError) {
        console.error("Failed to fetch token from AsyncStorage:", storageError);
        setError("Failed to fetch token");
        setLoading(false);
      }
    };

    decodeToken();
  }, []);


  const fetchParticipants = async (campId: string) => {
    try {
      const response = await axios.get(
        `http://192.168.10.20:5000/api/camps/participants/${campId}`
      );
      setParticipants(response.data.data.joinCampingPosts); // Assuming the endpoint returns an array of participants
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#42a5f5" />
      </View>
    );
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/default-avatar.webp")}
          style={styles.headerBackground}
        />
        <View style={styles.iconGroup}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons
              name="bell-outline"
              size={25}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="menu" size={25} color="white" />
          </TouchableOpacity>
        </View>
        <Image source={{ uri: userData?.imagesProfile?.[0]  || profileImage}} style={styles.headerProfileImage} />
      </View>
      <View style={styles.profileSection}>
        <Text style={styles.profileName}>{userData?.name || "User Name"}</Text>
        <View style={styles.profileInfo}>
          <FontAwesome name="birthday-cake" size={20} color="#fff" />
          <Text style={styles.profileAge}>
            {userData?.age || "N/A"} years old
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <MaterialCommunityIcons name="map-marker" size={20} color="#fff" />
          <Text style={styles.profileLocation}>
            {userData?.location || "N/A"}
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <FontAwesome name="info-circle" size={20} color="#fff" />
          <Text style={styles.profileBio}>
            {userData?.bio || "No bio available"}
          </Text>
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
          <MaterialCommunityIcons
            name="account-multiple"
            size={20}
            color="#fff"
          />
          <Text style={styles.statNumber}>{userData?.friendsCount || 0}</Text>
          <Text style={styles.statLabel}>Friends</Text>
        </View>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="campfire" size={20} color="#fff" />
          <Text style={styles.statNumber}>{userData?.campsJoined || 0}</Text>
          <Text style={styles.statLabel}>Camps Joined</Text>
        </View>
      </View>
      <View style={styles.interestsSection}>
        <Text style={styles.sectionTitle}>Interests</Text>
        <View style={styles.tickets}>
          {userData?.interests?.map((interest: string) => (
            <View key={interest} style={styles.ticket}>
              <FontAwesome name="star" size={15} color="#fff" />
              <Text style={styles.ticketText}>{interest}</Text>
            </View>
          ))}
        </View>
        <FlatList
          data={userData?.posts || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.campCard}
              onPress={() => handleCampPress(item.post)}
            >
              <Text style={styles.campTitle}>{item.post.title}</Text>
              <Text style={styles.campDescription}>
                {item.post.description}
              </Text>
              <MaterialCommunityIcons
                name="arrow-right"
                size={20}
                color="#42a5f5"
              />
            </TouchableOpacity>
          )}
        />
      </View>
      {selectedCamp && (
        <View style={styles.participantsSection}>
          <Text style={styles.sectionTitle}>Participants</Text>
          {participants.length > 0 ? (
            participants.map((participant) => {
              console.log("Participant:", participant);
              return (
                <View key={participant.id} style={styles.participantCard}>
                  <Image
                    source={{
                      uri: participant.user.imagesProfile?.[0] || profileImage,
                    }}
                    style={styles.profileImage}
                  />
            <Text style={styles.participantName}>{participant.user.name}</Text>
            <View style={styles.participantActions}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => handleAccept(participant.userId, selectedCamp.id)}
              >
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => handleReject(participant.userId, selectedCamp.id)}
              >
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })
    ) : (
      <Text>No participants found</Text>
    )}
  </View>
  
)}
 <View style={styles.sharedExperienceSection}>
        <SharedExp userId={userData?.id} /> {/* Integrate the SharedExp component */}
      </View>
</ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#014043",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#014043",
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "#B3492D",
  },
  header: {
    position: "relative",
    height: 250,
    backgroundColor: "#00595E",
    justifyContent: "center",
    alignItems: "center",
  },
  headerBackground: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    opacity: 0.3,
    position: "absolute",
  },
  headerProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
    marginTop: 30,
  },
  profileSection: {
    paddingHorizontal: 20,
    alignItems: "center",
  },
  profileName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  profileAge: {
    fontSize: 18,
    color: "#fff",
    marginLeft: 10,
  },
  profileLocation: {
    fontSize: 18,
    color: "#fff",
    marginLeft: 10,
  },
  profileBio: {
    fontSize: 18,
    color: "#fff",
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 20,
  },
  actionButton: {
    backgroundColor: "#B3492D",
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  statisticsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#00595E",
    paddingVertical: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  statLabel: {
    fontSize: 16,
    color: "#fff",
  },
  interestsSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 10,
  },
  tickets: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  ticket: {
    backgroundColor: "#00595E",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
  },
  ticketText: {
    color: "#fff",
    marginLeft: 5,
  },
  campCard: {
    backgroundColor: "#00595E",
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  campTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  campDescription: {
    fontSize: 16,
    color: "#fff",
    marginVertical: 5,
  },
  participantsSection: {
    paddingHorizontal: 20,
  },
  participantCard: {
    backgroundColor: "#00595E",
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  participantName: {
    fontSize: 16,
    color: "#fff",
  },
  participantActions: {
    flexDirection: "row",
  },
  acceptButton: {
    backgroundColor: "#7CBB00",
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  rejectButton: {
    backgroundColor: "#B3492D",
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  sharedExperienceSection: {
    padding: 20,
  },
});

export default Profile;
