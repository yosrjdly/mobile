// User Interface
interface User {
  id: number;
  email: string;
  password: string; // Encrypted password, should be handled securely
  name: string;
  address: string;
  interests: string[];
  imagesProfile: string[];
  gender: 'Men' | 'Women'; // Adjusted to be more specific
  bio: string;
  phoneNumber: string;
  dateOfBirth: string; // ISO 8601 date format
  createdAt: string; // ISO 8601 date format
  posts: Post[];
  joinCampingPosts: JoinCampingPost[];
  experiences: Experience[];
  likes: Like[];
  comments: Comment[];
  shares: Share[];
}

// Post Interface
interface Post {
  id: number;
  title: string;
  description: string;
  location: string;
  startDate: string; // ISO 8601 date format
  endDate: string;   // ISO 8601 date format
  equipment: string[]; // Array of equipment names
  places: number;
  ageCategory: 'TEEN' | 'ADULT';
  images: string[];
  organizerId: number;
  category: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  user: User;
  joinCampingPosts: JoinCampingPost[];
}

// JoinCampingPost Interface
interface JoinCampingPost {
  userId: number;
  postId: number;
  rating: number;
  reviews: string;
  favorite: 'Yes' | 'No';
  notification: string;
  status: 'ACCEPTED' | 'PENDING' | 'REJECTED';
  user: User;
  post: Post;
}

// Experience Interface
interface Experience {
  id: number;
  title: string;
  content: string;
  imagesUrl: string[];
  location: string;
  category: string;
  filterCategory: string;
  likeCounter: number;
  shareCounter: number;
  userId: number;
  createdAt: string; // ISO 8601 date format
  user: User;
  likes: Like[];
  comments: Comment[];
  shares: Share[];
}

// Like Interface
interface Like {
  id: number;
  experienceId: number;
  userId: number;
  user: User;
}

// Comment Interface
interface Comment {
  id: number;
  content: string;
  experienceId: number;
  userId: number;
  user: User;
}

// Share Interface
interface Share {
  id: number;
  experienceId: number;
  userId: number;
  user: User;
}


import { StyleSheet, Text, View, Image, ActivityIndicator, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router'; 
import axios from 'axios'; 

const UserProfile = () => {
  const { userId } = useLocalSearchParams(); 

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {

        const response = await axios.get(`http://192.168.10.4:5000/api/users/${userId}`);
        setUser(response.data);

      } catch (error) {
        setError('Error fetching user data');
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>No user data available</Text>
      </View>
    );
  }

  return (

    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image 
          source={{ uri: user.imagesProfile.length > 0 ? user.imagesProfile[0] : profileImage }} 
          style={styles.image} 
        />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.bio}>{user.bio || 'No bio available'}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Interests:</Text>
        {user.interests.length > 0 ? (
          <Text style={styles.interests}>{user.interests.join(', ')}</Text>
        ) : (
          <Text>No interests listed</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Posts:</Text>
        {user.posts.length > 0 ? (
          <FlatList
            data={user.posts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.postContainer}>
                <Text style={styles.postTitle}>{item.title}</Text>
                <Text>{item.description}</Text>
                <Text>Location: {item.location}</Text>
                <Text>Start Date: {new Date(item.startDate).toLocaleDateString()}</Text>
                <Text>End Date: {new Date(item.endDate).toLocaleDateString()}</Text>
                {item.images.length > 0 && (
                  <Image 
                    source={{ uri: item.images[0] }} 
                    style={styles.postImage} 
                  />
                )}
              </View>
            )}
            ListEmptyComponent={<Text>No posts available</Text>}
          />
        ) : (
          <Text>No posts available</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experiences:</Text>
        {user.experiences.length > 0 ? (
          <FlatList
            data={user.experiences}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.experienceContainer}>
                <Text style={styles.experienceTitle}>{item.title}</Text>
                <Text>{item.content}</Text>
                <Text>Location: {item.location}</Text>
                <Text>Category: {item.category}</Text>
                {item.imagesUrl.length > 0 && (
                  <Image 
                    source={{ uri: item.imagesUrl[0] }} 
                    style={styles.experienceImage} 
                  />
                )}
                
                <View style={styles.socialActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionText}>{item.likeCounter} Likes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionText}>{item.comments.length} Comments</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionText}>{item.shareCounter} Shares</Text>
                  </TouchableOpacity>
                </View>

                {item.comments.length > 0 && (
                  <View style={styles.commentsSection}>
                    <Text style={styles.subSectionTitle}>Comments:</Text>
                    {item.comments.slice(0, 3).map(comment => (
                      <View key={comment.id} style={styles.commentContainer}>
                        <View style={styles.commentHeader}>
                          <Image 
                            source={{ uri: comment.user.imagesProfile[0] || profileImage }} 
                            style={styles.commentUserImage} 
                          />
                          <Text style={styles.commentUserName}>{comment.user.name}</Text>
                        </View>
                        <Text>{comment.content || 'No content'}</Text>
                      </View>
                    ))}
                    {item.comments.length > 3 && (
                      <TouchableOpacity style={styles.showMoreButton}>
                        <Text style={styles.showMoreText}>View all {item.comments.length} comments</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
                
              </View>
            )}
            ListEmptyComponent={<Text>No experiences available</Text>}
          />
        ) : (
          <Text>No experiences available</Text>
        )}
      </View>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  profileHeader: {
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  email: {
    fontSize: 18,
    color: 'gray',
  },
  bio: {
    fontStyle: 'italic',
    marginVertical: 10,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  interests: {
    fontSize: 16,
  },
  postContainer: {
    marginVertical: 10,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postImage: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
  experienceContainer: {
    marginVertical: 10,
  },
  experienceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  experienceImage: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
  socialActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 16,
    color: '#007bff',
  },
  commentsSection: {
    marginVertical: 10,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  commentContainer: {
    marginVertical: 5,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  commentUserImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentUserName: {
    fontWeight: 'bold',
  },
  showMoreButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  showMoreText: {
    color: '#007bff',
    fontSize: 16,
  },
  error: {
    color: 'red',
  },
});

export default UserProfile;





