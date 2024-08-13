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

  // Fetch user data
  const fetchUserData = async (userId: string) => {
    try {
      const response = await axios.get(`http://192.168.10.13:5000/api/users/${userId}`);
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
    try {

      const response = await fetch('http://192.168.10.13:5000/api/camps/updateReview', {

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
    return <ActivityIndicator size="large" color="#B3492D" />;
  }

  const renderJoinedPost = ({ item }: { item: any }) => {
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
        <View style={styles.postDetails}>
          <Text style={styles.postTitle}>{item.post.title}</Text>
          <Text style={styles.text}>Status: {item.status}</Text>
          <Text style={styles.text}>Description: {item.post.description}</Text>
          <Text style={styles.text}>Category: {item.post.category}</Text>
          <Text style={styles.text}>StatusPost: Completed</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.text}>Rating:</Text>
            <View style={styles.ratingWrapper}>
              <Rating
                type='star'
                ratingCount={5}
                imageSize={24}
                readonly
                startingValue={item.rating}
              />
            </View>
          </View>
          <Text style={styles.text}>Review: {item.reviews}</Text>
          {isPostCompleted && (
            <Pressable
              style={styles.updateButton}
              onPress={() => {
                setSelectedPostId(item.postId.toString());
                setRating(item.rating || 0);
                setReviews(item.reviews || '');
                setModalVisible(true);
              }}
            >
              <Text style={styles.buttonText}>Update Review</Text>
            </Pressable>
          )}
        </View>
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
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Rate your experience:</Text>
            <AirbnbRating
              count={5}
              defaultRating={rating}
              size={30}
              onFinishRating={setRating}
              selectedColor="#B3492D"
              showRating={false}
            />
            <Text style={styles.modalText}>Write your review:</Text>
            <TextInput
              style={styles.input}
              value={reviews}
              onChangeText={setReviews}
              multiline
              placeholder="Enter your review here..."
              placeholderTextColor="#014043"
            />
            <Pressable
              style={[styles.button, styles.buttonSubmit]}
              onPress={submitReview}
            >
              <Text style={styles.buttonText}>Submit Review</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={closeModal}
            >
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00595E',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#014043',
    padding: 10,
    marginVertical: 10,
    width: '100%',
    borderRadius: 5,
    backgroundColor: '#F1FADA',
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#014043',
  },
  error: {
    color: '#B3492D',
    marginTop: 10,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    marginVertical: 10,
    color: '#F1FADA',
    fontWeight: 'bold',
  },
  postItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#B3492D',
    backgroundColor: '#014043',
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  postDetails: {
    marginTop: 10,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F1FADA',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  ratingWrapper: {
    marginLeft: 5,
    backgroundColor: 'transparent',
  },
  text: {
    color: '#F1FADA',
    marginBottom: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#F1FADA',
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    width: '100%',
    alignItems: 'center',
  },
  buttonSubmit: {
    backgroundColor: '#B3492D',
    marginVertical: 10,
  },
  buttonClose: {
    backgroundColor: '#00595E',
  },
  buttonText: {
    color: '#F1FADA',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#00595E',
  },
});

export default RatingAndReviews;
