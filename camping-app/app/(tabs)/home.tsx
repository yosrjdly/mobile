import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const Home = () => {
  const router = useRouter();
  const profileImage = require('../../assets/images/default-avatar.webp');

  const dummyPosts = [
    {
      id: 1,
      imageUrl: 'https://www.goodnet.org/photos/281x197/30805_hd.jpg',
      title: 'Camping by the Lake',
      location: 'Yosemite National Park, CA',
      description: 'A relaxing weekend getaway in the heart of nature.',
      host: {
        profileImage: 'https://parrotprint.com/wp/wp-content/uploads/2017/04/pexels-photo-27411.jpg',
        name: 'John Doe',
      },
    },
    {
      id: 2,
      imageUrl: 'https://placeimg.com/640/480/arch',
      title: 'Hiking in Arches National Park',
      location: 'Moab, UT',
      description: 'Explore stunning rock formations and desert landscapes.',
      host: {
        profileImage: 'https://parrotprint.com/wp/wp-content/uploads/2017/04/pexels-photo-27411.jpg',
        name: 'Jane Smith',
      },
    },
    // Add more dummy posts as needed
  ];
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.campSkoutText}>CampSkout</Text>
        <View style={styles.iconGroup}>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="search" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="medical-bag" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="menu" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.actionSection}>
        <Image source={profileImage} style={styles.profileImage} />
        <TouchableOpacity style={[styles.actionButton, styles.campingPostButton]}>
          <MaterialCommunityIcons name="tent" size={24} color="white" />
          <Text style={styles.actionButtonText}>Add a Camp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.experiencesButton]}>
          <Feather name="book" size={24} color="white" />
          <Text style={styles.actionButtonText}>Experiences</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.postList}>
        {dummyPosts.map((post) => (
          <View style={styles.postContainer} key={post.id}>
            <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
            <View style={styles.overlay} />
            <View style={styles.postInfo}>
              <TouchableOpacity style={styles.heartButton}>
                <MaterialCommunityIcons name="heart-outline" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postLocation}>
                <MaterialCommunityIcons name="map-marker-outline" size={18} color="#fff" /> {post.location}
              </Text>
              {post.host && (
                <View style={styles.hostInfo}>
                  <Image source={{ uri: post.host.profileImage }} style={styles.hostProfileImage} />
                  <Text style={styles.hostName}>{post.host.name}</Text>
                </View>
              )}
              <View style={styles.postActions}>
                <TouchableOpacity onPress={() => router.push(`/${post.id}`)} style={styles.exploreButton}>
                  <Text style={styles.exploreText}>Explore</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00595E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#014043',
  },
  campSkoutText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 24,
  },
  iconGroup: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 15,
  },
  actionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#014043',
    marginHorizontal: 10,
    marginVertical: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B3492D',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    flex: 1,
    justifyContent: 'center',
  },
  campingPostButton: {
    marginRight: 10,
  },
  experiencesButton: {
    marginLeft: 10,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 10,
  },
  postList: {
    padding: 20,
  },
  postContainer: {
    position: 'relative',
    backgroundColor: 'transparent',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    height: height * 0.4, // Adjust the height as needed
  },
  postImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)', // Add an overlay to make text readable
  },
  postInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'rgba(0, 89, 94, 0.4)', // Darker background to ensure text readability
  },
  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center',
  },
  postLocation: {
    color: '#fff',
    marginBottom: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  hostProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  hostName: {
    color: '#fff',
    fontSize: 14,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exploreButton: {
    backgroundColor: '#B3492D',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 50,
  },
  exploreText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Home;
