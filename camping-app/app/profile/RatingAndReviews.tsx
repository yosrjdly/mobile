import { StyleSheet, Text, View, TextInput, Alert, ActivityIndicator, FlatList, Image, Modal, Pressable, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JWT from 'expo-jwt';
import { AirbnbRating, Rating } from 'react-native-ratings';

const RatingAndReviews = () => {
  const [userData, setUserData] = useState<any>(null);
  const [postId, setPostId] = useState('');
  const [userId, setUserId] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [reviews, setReviews] = useState('');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUserAccepted, setIsUserAccepted] = useState<boolean>(false);
  const [postsJoined, setPostsJoined] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleUpdateReview = async () => {
    try {
      const response = await fetch('http://192.168.10.4:5000/api/camps/updateReview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: Number(selectedPostId),
          userId: Number(userId),
          rating,
          reviews,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', data.msg);
        fetchUserData(userId); // Refresh data after update
      } else {
        Alert.alert('Error', data.message || 'Failed to update review');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  const fetchUserData = async (userId: string) => {
    try {
      const response = await axios.get(`http://192.168.10.4:5000/api/users/${userId}`);
      const user = response.data.user;
      const joinedPosts = user.joinCampingPosts;

      setUserData({
        id: user.id,
        name: user.name,
        camps: response.data.posts,
        joinCampingPosts: joinedPosts,
      });
      setUserId(user.id);
      if (joinedPosts.length > 0) {
        setPostId(joinedPosts[0].postId.toString());
      }

      // Filter posts to include only those with status 'ACCEPTED' and post.status 'Completed'
      const acceptedAndCompletedPosts = joinedPosts.filter((post: any) =>
        post.status === 'ACCEPTED' && post.post.status === 'Completed'
      );
      setPostsJoined(acceptedAndCompletedPosts);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to fetch user data');
    } finally {
      setLoading(false);
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
  }, []); // Empty dependency array ensures this runs only on mount

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const renderJoinedPost = ({ item }: { item: any }) => {
    // Check if the post status is 'Completed'
    const isPostCompleted = item.post.status === 'Completed';

    return (
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
       
          <Text>StatusPost: Completed</Text>
        
        <View style={styles.ratingContainer}>
          <Text>Rating:</Text>
          <Rating
            type='star'
            ratingCount={5}
            imageSize={20}
            readonly
            startingValue={item.rating} // Display the rating
          />
        </View>
        <Text>Review: {item.reviews}</Text>
        {isPostCompleted && (
          <Pressable
            style={styles.updateButton} // Apply the new button style
            onPress={() => {
              
              setSelectedPostId(item.postId.toString());
              setRating(item.rating || 0);
              setReviews(item.reviews || '');
              setModalVisible(true);
            }}
          >
            <Text style={styles.textStyle}>Update Review</Text>
          </Pressable>
        )}
      </View>
    );
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPostId(null);
  };

  const submitReview = () => {
    handleUpdateReview();
    closeModal();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>Posts Joined by User</Text>
        <FlatList
          data={postsJoined}
          renderItem={renderJoinedPost}
          keyExtractor={(item) => item.postId.toString()}
        />
        {error && <Text style={styles.error}>{error}</Text>}
      </ScrollView>
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
            onFinishRating={setRating} // Update rating when user selects
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
    flex: 1,
    backgroundColor: '#014043',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
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
    color: '#fff', // Optional: to make the title stand out
  },
  postItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff', // Optional: background color for the posts
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
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    marginVertical: 10,
  },
  updateButton: {
    backgroundColor: '#B3492D', // New button color
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    alignItems: 'center', // Center text within the button
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default RatingAndReviews;


