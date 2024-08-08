import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ActivityIndicator, Modal } from "react-native";
import axios from "axios";
import profileImage from "../../assets/images/default-avatar.webp";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import JWT from "expo-jwt";

const Profile = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [selectedCamp, setSelectedCamp] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  

  const handleCampPress = (camp: any) => {
    setSelectedCamp(camp);
    fetchParticipants(camp.id);
    setModalVisible(true);
  };

  const handleAccept = async (userId: string, postId: string) => {
    try {

      await axios.post(`http://192.168.10.4:5000/api/acceptAndReject/${userId}/${postId}`);
      setParticipants(prevParticipants =>
        prevParticipants.map(participant =>
          participant.userId === userId && participant.postId === postId
            ? { ...participant, status: "accepted" }
            : participant
        )
      );
    } catch (error) {
      console.error("Error accepting participant:", error);
    }
  };

  const handleReject = async (userId: string, postId: string) => {
    try {

      await axios.post(`http://192.168.10.4:5000/api/acceptAndReject/reject/${userId}/${postId}`);

      setParticipants(prevParticipants =>
        prevParticipants.map(participant =>
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

        const response = await axios.get(`http://192.168.10.4:5000/api/users/${userId}`);

        setUserData({
          id: response.data.user.id,
          name: response.data.user.name,
          camps: response.data.posts,
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
          const token = tokenData.startsWith("Bearer ")
            ? tokenData.replace("Bearer ", "")
            : tokenData;
          const key = "mySuperSecretPrivateKey";
          const decodedToken = JWT.decode(token, key);
          if (decodedToken && decodedToken.id) {
            fetchUserData(decodedToken.id);
          } else {
            setError("Failed to decode token or token does not contain ID");
          }
        } else {
          setError("Token not found");
        }
      } catch (error) {
        setError("Failed to fetch token");
      } finally {
        setLoading(false);
      }
    };

    decodeToken();
  }, []);

  const fetchParticipants = async (campId: string) => {
    try {

      const response = await axios.get(`http://192.168.10.4:5000/api/camps/participants/${campId}`);
      setParticipants(response.data.data.joinCampingPosts);
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
      <View style={styles.profileContainer}>
        <Text style={styles.sectionTitle}>My Camps</Text>
        <View style={styles.campContainer}>
          {userData?.camps && userData.camps.length > 0 ? (
            userData.camps.map((item: any) => (
              <TouchableOpacity
                key={item.id}
                style={styles.campCard}
                onPress={() => handleCampPress(item.post)}
              >
                {item.post.images.length > 0 && (
                  <Image
                    source={{ uri: item.post.images[0] }}
                    style={styles.postImage}
                  />
                )}
                <View style={styles.textOverlay}>
                  <Text style={styles.campTitle}>{item.post.title}</Text>
                  <Text style={styles.campDescription}>{item.post.description}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noPosts}>No camps available.</Text>
          )}
        </View>
      </View>

      {selectedCamp && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.sectionTitle}>Participants</Text>
              {participants.length > 0 ? (
                participants.map(participant => {
                  const image = participant.user.imagesProfile[0] ? { uri: participant.user.imagesProfile[0] } : profileImage;
                  return (
                    <View key={participant.id} style={styles.participantCard}>
                      <Image source={image} style={styles.profileImage} />
                      <View style={styles.participantInfo}>
                        <Text style={styles.participantName}>{participant.user.name}</Text>
                        <View style={styles.participantActions}>
                          <TouchableOpacity
                            style={[styles.actionButton, styles.acceptButton]}
                            onPress={() => handleAccept(participant.userId, selectedCamp.id)}
                          >
                            <Text style={styles.buttonText}>Accept</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.actionButton, styles.rejectButton]}
                            onPress={() => handleReject(participant.userId, selectedCamp.id)}
                          >
                            <Text style={styles.buttonText}>Reject</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  );
                })
              ) : (
                <Text>No participants found</Text>
              )}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
  profileContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 10,
  },
  campContainer: {
    marginVertical: 10,
  },
  campCard: {
    backgroundColor: "#00595E",
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  textOverlay: {
    marginTop: 10,
  },
  campTitle: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
  },
  campDescription: {
    fontSize: 16,
    color: "#fff",
  },
  noPosts: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#00595E",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%", // Ensure modal doesn't overflow the screen
  },
  participantCard: {
    backgroundColor: "#004d40",
    flexDirection: "row",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  participantInfo: {
    flex: 1,
    justifyContent: "center",
  },
  participantName: {
    fontSize: 18,
    color: "#fff",
  },
  participantActions: {
    flexDirection: "row",
    marginTop: 5,
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#00796B",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Profile;
