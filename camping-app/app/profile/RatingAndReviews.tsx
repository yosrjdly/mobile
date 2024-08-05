import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator, FlatList, Image, Modal, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JWT from 'expo-jwt';
import { AirbnbRating, Rating } from 'react-native-ratings';  // Import the Rating component

const RatingAndReviews = () => {
  const [userData, setUserData] = useState<any>(null);
  const [postId, setPostId] = useState('');
  const [userId, setUserId] = useState('');
  const [rating, setRating] = useState<number>(0);  // Changed to number
  const [reviews, setReviews] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUserAccepted, setIsUserAccepted] = useState<boolean>(false);
  const [postsJoined, setPostsJoined] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Fetch user data
  const fetchUserData = async (userId: string) => {
    try {
      const response = await axios.get(`http://192.168.10.20:5000/api/users/${userId}`);
      const user = response.data.user;
      setUserData({
        id: user.id,
        name: user.name,
        camps: response.data.posts,
        joinCampingPosts: user.joinCampingPosts,
      });
      setUserId(user.id);
      if (user.joinCampingPosts.length > 0) {
        setPostId(user.joinCampingPosts[0].postId.toString());
      }

      const acceptedStatus = user.joinCampingPosts.some(
        (post: any) => post.postId === Number(postId) && post.status === 'ACCEPTED'
      );
      setIsUserAccepted(acceptedStatus);
      setPostsJoined(user.joinCampingPosts);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  // Handle update review
  const handleUpdateReview = async () => {
    if (!isUserAccepted) {
      Alert.alert('Error', 'You are not accepted to join this trip, so you cannot review or rate it.');
      return;
    }

    try {
      const response = await fetch('http://192.168.10.20:5000/api/camps/updateReview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: Number(postId),
          userId: Number(userId),
          rating,
          reviews,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', data.msg);
        // Refresh data after update
        fetchUserData(userId);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  useEffect(() => {
    const decodeToken = async () => {
      try {
        const tokenData = await AsyncStorage.getItem('token');
        if (tokenData) {
          const token = tokenData.startsWith('Bearer ')
            ? tokenData.replace('Bearer ', '')
            : tokenData;
          const key = 'mySuperSecretPrivateKey';
          const decodedToken = JWT.decode(token, key);
          if (decodedToken && decodedToken.id) {
            fetchUserData(decodedToken.id);
          } else {
            setError('Failed to decode token or token does not contain ID');
          }
        } else {
          setError('Token not found');
        }
      } catch (error) {
        setError('Failed to fetch token');
      } finally {
        setLoading(false);
      }
    };

    decodeToken();
  }, [postId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const renderJoinedPost = ({ item }: { item: any }) => (
    <View style={styles.postItem}>
      {item.post && item.post.images && item.post.images.length > 0 && (
        <Image
          source={{ uri: item.post.images[0] }}
          style={styles.postImage}
          resizeMode="cover"
        />
      )}
      <Text style={styles.postTitle}>Title: {item.post.title}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Description: {item.post.description}</Text>
      <Text>Category: {item.post.category}</Text>
      <View style={styles.ratingContainer}>
        <Text>Rating:</Text>
        <Rating
          type='star'
          ratingCount={5}
          imageSize={20}
          readonly
          startingValue={item.rating}  // Display the rating
        />
      </View>
      <Text>Review: {item.reviews}</Text>
    </View>
  );

  const openModal = () => {
    if (!isUserAccepted) {
      Alert.alert('Error', 'You are not accepted to join this trip, so you cannot update your review.');
      return;
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const submitReview = () => {
    handleUpdateReview();
    closeModal();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Posts Joined</Text>
      <FlatList
        data={postsJoined}
        renderItem={renderJoinedPost}
        keyExtractor={(item) => item.postId.toString()}
      />
      <Button title="Update Review" onPress={openModal} />
      {error && <Text style={styles.error}>{error}</Text>}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalView}>
          <Text>Rating:</Text>
          <AirbnbRating
            count={5}
            defaultRating={rating}
            size={20}
            onFinishRating={setRating}  // Update rating when user selects
          />
          <Text>Reviews:</Text>
          <TextInput
            style={styles.input}
            value={reviews}
            onChangeText={setReviews}
            multiline
          />
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={submitReview}
          >
            <Text style={styles.textStyle}>Submit Review</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={closeModal}
          >
            <Text style={styles.textStyle}>Close</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    marginVertical: 10,
  },
  postItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  postTitle: {
    fontWeight: 'bold',
  },
  postImage: {
    width: 100,
    height: 100,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#00796b',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    marginVertical: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default RatingAndReviews;

