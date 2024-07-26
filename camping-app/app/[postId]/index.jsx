import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const dummyPosts = [
  {
    id: 1,
    imageUrl: 'https://www.goodnet.org/photos/281x197/30805_hd.jpg',
    title: 'Camping by the Lake',
    location: 'Yosemite National Park, CA',
    description: 'Camping above the clouds is a breathtaking experience that offers campers the chance to witness stunning panoramic views from high altitudes, often above 2,000 meters (6,500 feet).',
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
    campMates: [
      {
        profileImage: 'https://example.com/camper1.jpg',
        name: 'Alice Smith',
      },
      {
        profileImage: 'https://example.com/camper2.jpg',
        name: 'Bob Johnson',
      },
    ],
  },
  // Add more dummy posts as needed
];

const PostDetailScreen = () => {
  const { postId } = useLocalSearchParams();

  // Find the post based on postId
  const post = dummyPosts.find((post) => post.id === parseInt(postId, 10));

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Post not found!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={[styles.imageCardContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
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
      </Animated.View>
      <Animated.View style={[styles.detailsContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.postInfo}>
          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.postDescription}>{post.description}</Text>
          <View style={styles.equipmentSection}>
            <Text style={styles.equipmentSubtitle}>Equipment:</Text>
            {post.equipment.map((item, index) => (
              <Text key={index} style={styles.equipmentItem}>- {item}</Text>
            ))}
          </View>
          {post.host && (
            <View style={styles.hostInfo}>
              <Image source={{ uri: post.host.profileImage }} style={styles.hostProfileImage} />
              <Text style={styles.hostName}>{post.host.name}</Text>
            </View>
          )}
          <View style={styles.campMatesSection}>
            <Text style={styles.campMatesTitle}>Campmates:</Text>
            <View style={styles.campMatesList}>
              {post.campMates.map((mate, index) => (
                <View key={index} style={styles.campMate}>
                  <Image source={{ uri: mate.profileImage }} style={styles.campMateImage} />
                  <Text style={styles.campMateName}>{mate.name}</Text>
                </View>
              ))}
            </View>
          </View>
          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinButtonText}>Join Us</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00595E',
  },
  imageCardContainer: {
    height: 380,
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginBottom: 0,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  postImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 0,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  infoCard: {
    width: width * 0.5 - 80, 
    height: width * 0.5 - 80, 
    padding: 10,
    borderRadius: 15,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    fontSize: 10,
  },
  detailsContainer: {
    width: width - 30,
    marginHorizontal: 15,
    marginTop: -100, // Position the details container to overlap the image
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
  equipmentSection: {
    marginBottom: 10,
  },
  equipmentSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  equipmentItem: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 3,
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
  campMatesSection: {
    marginTop: 20,
  },
  campMatesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  campMatesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  campMate: {
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 15,
  },
  campMateImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 5,
  },
  campMateName: {
    color: '#fff',
    fontSize: 14,
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
