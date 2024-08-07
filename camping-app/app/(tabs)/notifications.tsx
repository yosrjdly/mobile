import { StyleSheet, Text, View, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JWT from 'expo-jwt';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  imagesProfile: string[];
  joinCampingPosts: JoinCampingPost[];
  posts:Post[]
}

interface Post {
  id: number;
  title: string;
  description: string;
  location: string;
  startDate: string; 
  endDate: string; 
  equipment: string[];
  places: number;
  ageCategory: "ADULT" | "CHILD" | "TEEN";
  images: string[];
  organizerId: number;
  category: string;
  status: "InProgress" | "Completed" | "Cancelled";
  joinCampingPosts: JoinCampingPost[];
}

interface JoinCampingPost {
  userId: number;
  postId: number;
  rating: number;
  reviews: string;
  favorite: "Yes" | "No";
  notification: string;
  status: "ACCEPTED" | "REJECTED" | "PENDING";
  user: User;
  post: Post;
}

const Notifications = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async (userId: string) => {
      try {
        const response = await axios.get(
          `http://192.168.10.4:5000/api/users/${userId}`
        );
        console.log("User data fetched:", response.data);
        setUser({
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          imagesProfile:response.data.user.imagesProfile,
          joinCampingPosts:response.data.user.joinCampingPosts,
          posts:response.data.posts
         
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
              fetchUserData(decodedToken.id);
            } else {
              console.error("Failed to decode token or token does not contain ID");
              setError("Failed to decode token or token does not contain ID");
            }
          } catch (decodeError) {
            console.error("Error decoding token:", decodeError);
            setError("Failed to decode token");
          }
        } else {
          console.error("Token not found in AsyncStorage");
          setError("Token not found");
        }
      } catch (storageError) {
        console.error("Failed to fetch token from AsyncStorage:", storageError);
        setError("Failed to fetch token");
      }
    };

    decodeToken();
  }, []);
  console.log('user',user?.joinCampingPosts)

  if (loading) {
    return <Text style={styles.message}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.message}>{error}</Text>;
  }

  const profileImageUrl = user?.imagesProfile?.[0] || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRuRip5LBOHjlx6SIMhLsGHLxpw_wUUXG8Z0sz9YUBaP9PstT_BmRY1CGaFBqqDeFAX9w&usqp=CAU';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      {user?.joinCampingPosts?.map((notification, index) => (
        <View key={index} style={styles.notification}>
          <Image style={styles.profile} source={{ uri: profileImageUrl }} />
          <View style={styles.info}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.message}>{notification.notification}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00595E', // Background color consistent with other components
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#F0F8FF',
    marginBottom: 20,
    textAlign: 'center', // Center the title
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#014043', // Card background color consistent with other components
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  profile: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F0F8FF',
  },
  message: {
    fontSize: 16,
    color: '#B0BEC5', // Text color consistent with other components
  },
});
