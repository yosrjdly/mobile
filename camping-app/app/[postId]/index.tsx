import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const dummyPosts = [
  {
    id: 1,
    imageUrl: 'https://www.goodnet.org/photos/281x197/30805_hd.jpg',
    title: 'Camping by the Lake',
    location: 'Yosemite National Park, CA',
    description: 'A relaxing weekend getaway in the heart of nature.',
    startDate: '2023-07-20',
    endDate: '2023-07-22',
    equipment: ['Tent', 'Sleeping Bag', 'Backpack'],
    places: 20,
    currentPlaces: 0,
    ageCategory: 'ADULT',
    images: [
      'https://www.goodnet.org/photos/281x197/30805_hd.jpg',
      'https://placeimg.com/640/480/nature'
    ],
    host: {
      profileImage: 'https://example.com/host1.jpg',
      name: 'John Doe',
    },
  },
  // Add more dummy posts as needed
];

const PostDetailScreen = () => {
  const { postId } = useLocalSearchParams();

  // Find the post based on postId
  const post = dummyPosts.find((post) => post.id === parseInt(postId, 10));

  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Post not found!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageCardContainer}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
          <View style={styles.overlay}>
            <View style={styles.infoRow}>
              <View style={[styles.infoCard, { backgroundColor: 'rgba(179, 73, 45, 0.7)' }]}>
                <FontAwesome name="map-marker" size={30} color="#fff" />
                <Text style={styles.infoText}>{post.location}</Text>
              </View>
              <View style={[styles.infoCard, { backgroundColor: 'rgba(0, 89, 94, 0.7)' }]}>
                <FontAwesome name="users" size={30} color="#fff" />
                <Text style={styles.infoText}>{post.ageCategory}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={[styles.infoCard, { backgroundColor: 'rgba(179, 73, 45, 0.7)' }]}>
                <FontAwesome name="calendar" size={30} color="#fff" />
                <Text style={styles.infoText}>{post.startDate}</Text>
              </View>
              <View style={[styles.infoCard, { backgroundColor: 'rgba(0, 89, 94, 0.7)' }]}>
                <FontAwesome name="user-plus" size={30} color="#fff" />
                <Text style={styles.infoText}>{post.currentPlaces}/{post.places}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.postInfo}>
          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.postDescription}>{post.description}</Text>
          <Text style={styles.postDetail}>Equipment: {post.equipment.join(', ')}</Text>
      
          {post.host && (
            <View style={styles.hostInfo}>
              <Image source={{ uri: post.host.profileImage }} style={styles.hostProfileImage} />
              <Text style={styles.hostName}>{post.host.name}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinButtonText}>Join Us</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00595E',
  },
  imageCardContainer: {
    backgroundColor: '#00595E',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
  },
  postImage: {
    width: width,
    height: width * 0.5,
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  infoCard: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  detailsContainer: {
    width: width - 30,
    marginHorizontal: 15,
    marginTop: -80,
  },
  postInfo: {
    backgroundColor: '#004d49',
    borderRadius: 15,
    padding: 15,
    marginTop: 10,
  },
  postTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  postDescription: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  postDetail: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  additionalImage: {
    width: width - 30,
    height: width * 0.3,
    resizeMode: 'cover',
    marginVertical: 5,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  hostProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  hostName: {
    color: '#fff',
    fontSize: 18,
  },
  joinButton: {
    backgroundColor: '#B3492D',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PostDetailScreen;
