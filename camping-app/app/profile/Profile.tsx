// src/components/Profile/Profile.tsx
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import JWT from "expo-jwt";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import SharedExp from "../../components/SharedExp";
import profileImage from "../../assets/images/default-avatar.webp"; // Default profile image
import { useNavigation } from '@react-navigation/native';


const { width } = Dimensions.get("window");


const Profile = () => {
    const navigation = useNavigation();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async (userId: string) => {
            try {

                const response = await axios.get(`http://192.168.10.4:5000/api/users/${userId}`);

                console.log("User data fetched:", response.data, response.data.posts);
                setUserData({
                    id: response.data.user.id,
                    name: response.data.user.name,
                    email: response.data.user.email,
                    age: response.data.user.age,
                    imagesProfile: response.data.user.imagesProfile,
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
                    const token = tokenData.startsWith("Bearer ")
                        ? tokenData.replace("Bearer ", "")
                        : tokenData;
                    const key = "mySuperSecretPrivateKey";

                    try {
                        const decodedToken = JWT.decode(token, key);
                        if (decodedToken && decodedToken.id) {
                            // Fetch user data based on ID from decoded token

                            const response = await axios.get(`http://192.168.10.4:5000/api/users/${decodedToken.id}`);

                            setUser(response.data);
                            setUserData({
                                id: response.data.id,
                                name: response.data.name,
                                email: response.data.email,
                                age: response.data.age,
                                location: response.data.location,
                                bio: response.data.bio,
                                friendsCount: response.data.friendsCount,
                                interests: response.data.interests,
                                posts: response.data.posts,
                            });

                            fetchUserData(decodedToken.id);
                        } else {
                            console.error("Failed to decode token or token does not contain ID");
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
                <TouchableOpacity
                    style={styles.homeIcon}
                    onPress={() => router.push("home")}
                >
                    <MaterialIcons name="home" size={30} color="#fff" />
                </TouchableOpacity>
                <Image
                    source={{ uri: 'https://images5.alphacoders.com/112/1129765.jpg' }}
                    style={styles.headerBackground}
                />
                <Image source={{ uri: userData?.imagesProfile?.[0] || profileImage }} style={styles.headerProfileImage} />
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
                    <TouchableOpacity style={[styles.actionButton, styles.addCampButton]}>
                        <Text style={styles.buttonText}>Add Camp</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={()=>router.replace('createExp/CreateExp')} style={[styles.actionButton, styles.addExperienceButton]}>
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
                    <MaterialCommunityIcons
                        name="campfire"
                        size={20}
                        color="#fff"
                    />
                    <Text style={styles.statNumber}>{userData?.joinedUsers?.length || 0}</Text>
                    <Text style={styles.statLabel}>Camps Joined</Text>
                </View>
            </View>
            <View style={styles.interestsSection}>
    <Text style={styles.sectionTitle}>Interests</Text>
    <View style={styles.tickets}>
        {userData?.interests?.map((interest: string, index: number) => (
            <View key={`${interest}-${index}`} style={styles.ticket}>
                <FontAwesome name="star" size={15} color="#fff" />
                <Text style={styles.ticketText}>{interest}</Text>
            </View>
        ))}
    </View>
</View>
            <View style={styles.sharedExperienceSection}>
                <SharedExp userId={userData?.id} />
                {/* Integrate the SharedExp component */}
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
  homeIcon: {
      position: "absolute",
      top: 30,
      left: 15,
      zIndex: 1,
  },
  headerBackground: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
      opacity: 0.9,
      position: "absolute",
  },
  headerProfileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 3,
      borderColor: "#fff",
      marginTop: 140,
  },
  profileSection: {
      paddingHorizontal: 20,
      alignItems: "center",
  },
  profileName: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#fff",
      marginVertical: 10,
  },
  profileInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 5,
  },
  profileAge: {
      marginLeft: 5,
      fontSize: 16,
      color: "#fff",
  },
  profileLocation: {
      marginLeft: 5,
      fontSize: 16,
      color: "#fff",
  },
  profileBio: {
      marginLeft: 5,
      fontSize: 16,
      color: "#fff",
  },
  buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: width - 40,
      marginVertical: 10,
      height: 60, 
  },
  actionButton: {
      paddingVertical: 8, 
      paddingHorizontal: 15, 
      borderRadius: 30, 
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      marginHorizontal: 5,
      shadowColor: "#000", 
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 5, 
  },
  addCampButton: {
      backgroundColor: "#B3492D",
      borderWidth: 1, 
      borderColor: "#fff",
  },
  addExperienceButton: {
      backgroundColor: "#B3492D",
      borderWidth: 1, 
      borderColor: "#fff",
  },
  buttonText: {
      color: "#fff",
      fontSize: 15, 
      fontWeight: "bold", 
      textAlign: "center",
  },
  statisticsSection: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingVertical: 20,
      backgroundColor: "#004D40",
  },
  statItem: {
      alignItems: "center",
  },
  statNumber: {
      fontSize: 20,
      color: "#fff",
  },
  statLabel: {
      color: "#fff",
  },
  interestsSection: {
      paddingHorizontal: 20,
      paddingVertical: 10,
  },
  sectionTitle: {
      fontSize: 20,
      color: "#fff",
      marginBottom: 10,
  },
  tickets: {
      flexDirection: "row",
      flexWrap: "wrap",
  },
  ticket: {
      backgroundColor: "#004D40",
      padding: 10,
      borderRadius: 5,
      margin: 5,
      flexDirection: "row",
      alignItems: "center",
  },
  ticketText: {
      marginLeft: 5,
      color: "#fff",
  },
  sharedExperienceSection: {
      marginVertical: 20,
      paddingHorizontal: 20,
  },
});



export default Profile;