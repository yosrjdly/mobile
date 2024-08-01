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
        const response = await axios.get(`http://192.168.10.7:5000/api/share/all/${userId}`);
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
        <ActivityIndicator size="large" color="#0000ff" />
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
    <View style={styles.container}>
      {sharedExperiences.length === 0 ? (
        <Text style={styles.noDataText}>No experiences shared yet.</Text>
      ) : (
        <FlatList
          data={sharedExperiences}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.experienceContainer}>
              <View style={styles.userContainer}>
                {item.experience.user.imagesProfile.length > 0 ? (
                  <Image source={{ uri: item.experience.user.imagesProfile[0] }} style={styles.userProfileImage} />
                ) : (
                  <Image  style={styles.userProfileImage} /> // Use a default image if no profile image is available
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
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  noDataText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
  experienceContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 16,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    fontSize: 16,
    marginVertical: 8,
  },
  image: {
    width: 200,
    height: 120,
    borderRadius: 8,
    marginRight: 8,
  },
  info: {
    fontSize: 16,
    marginVertical: 4,
  },
  infoValue: {
    fontWeight: 'bold',
  },
});

export default SharedExp;
