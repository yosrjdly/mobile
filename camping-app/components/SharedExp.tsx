import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

const SharedExp = ({ userId }) => {
  const [sharedExperiences, setSharedExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchSharedExperiences = async () => {
      try {
        const response = await axios.get(`http://192.168.10.4:5000/api/share/all/${userId}`);
        setSharedExperiences(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedExperiences();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error fetching shared experiences.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={sharedExperiences}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.userContainer}>
            {item.experience.user.imagesProfile.length > 0 ? (
              <Image source={{ uri: item.experience.user.imagesProfile[0] }} style={styles.userProfileImage} />
            ) : (
              <View style={styles.noProfileImage}>
                <Text style={styles.noProfileText}>No Image</Text>
              </View>
            )}
            <Text style={styles.userName}>{item.experience.user.name}</Text>
          </View>
          <Text style={styles.title}>{item.experience.title}</Text>
          <Text style={styles.content}>{item.experience.content}</Text>
          <FlatList
            data={item.experience.imagesUrl}
            horizontal
            keyExtractor={(url, index) => index.toString()}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.image} />
            )}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.info}>
              Location: <Text style={styles.infoValue}>{item.experience.location}</Text>
            </Text>
            <Text style={styles.info}>
              Category: <Text style={styles.infoValue}>{item.experience.category}</Text>
            </Text>
            <Text style={styles.info}>
              Shares: <Text style={styles.infoValue}>{item.experience.shareCounter}</Text>
            </Text>
            <Text style={styles.info}>
              Likes: <Text style={styles.infoValue}>{item.experience.likeCounter}</Text>
            </Text>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'white',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#00595E',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // For Android shadow effect
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 8,
  },
  noProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  noProfileText: {
    color: '#888',
    fontSize: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    color: 'white',
    marginBottom: 8,
  },
  image: {
    width: 250,
    height: 150,
    borderRadius: 8,
    marginRight: 8,
  },
  infoContainer: {
    marginTop: 8,
  },
  info: {
    fontSize: 16,
    color: 'white',
    marginBottom: 4,
  },
  infoValue: {
    fontWeight: 'bold',
  },
});

export default SharedExp;
