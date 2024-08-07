import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JWT from 'expo-jwt';

const { width } = Dimensions.get('window');

const statuses = ['All', 'PENDING', 'InProgress', 'Completed', 'Canceled', 'Delegated'];

interface Camp {
  id: number;
  title: string;
  location: string;
  category: string;
  status: string;
  images: string[];
  user: {
    id: string;
    name: string;
    imagesProfile: string[];
  };
}

const MyCamps = () => {
  const [camps, setCamps] = useState<Camp[]>([]);
  const [filteredCamps, setFilteredCamps] = useState<Camp[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    if (status === 'All') {
      setFilteredCamps(camps);
    } else {
      setFilteredCamps(camps.filter(camp => camp.status === status));
    }
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const tokenData = await AsyncStorage.getItem("token");
        if (tokenData) {
          const token = tokenData.startsWith("Bearer ")
            ? tokenData.replace("Bearer ", "")
            : tokenData;
          const key = "mySuperSecretPrivateKey";
          const decodedToken = JWT.decode(token, key);

          if (decodedToken && decodedToken.id) {
            setUserId(decodedToken.id);
          } else {
            setError("Failed to decode token or token does not contain ID");
          }
        } else {
          setError("Token not found in AsyncStorage");
        }
      } catch (error) {
        setError("Failed to fetch token");
      }
    };

    const fetchMyCamps = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(`http://192.168.10.4:5000/api/camps/user/${userId}/campings`);
        const campsData = response.data.data;

        // Ensure unique IDs
        const uniqueCamps = campsData.reduce((acc, camp) => {
          if (!acc.some(existingCamp => existingCamp.id === camp.id)) {
            acc.push(camp);
          }
          return acc;
        }, []);

        setCamps(uniqueCamps);
        setFilteredCamps(uniqueCamps);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserId().then(fetchMyCamps);
  }, [userId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#42a5f5" style={styles.loadingText} />;
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Camps</Text>
      </View>
      <View style={styles.categorySection}>
        {statuses.map(status => (
          <TouchableOpacity
            key={status}
            style={[styles.statusButton, selectedStatus === status && styles.selectedStatusButton]}
            onPress={() => handleStatusChange(status)}
          >
            <Text style={styles.statusButtonText}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.postList}>
        {filteredCamps.map(camp => (
          <View style={styles.postContainer} key={camp.id}>
            <Image source={{ uri: camp.images[0] }} style={styles.postImage} />
            <View style={styles.postOverlay}>
              <View style={styles.textOverlay}>
                <Text style={styles.postTitle}>{camp.title}</Text>
                <Text style={styles.postLocation}>
                  <MaterialCommunityIcons name="map-marker-outline" size={18} color="#fff" /> {camp.location}
                </Text>
                <Text style={styles.postCategory}>
                  <MaterialCommunityIcons name="tag-outline" size={18} color="#fff" /> {camp.category}
                </Text>
                {camp.user && (
                  <View style={styles.hostInfo}>
                    <Image source={{ uri: camp.user.imagesProfile[0] || 'https://via.placeholder.com/50' }} style={styles.hostProfileImage} />
                    <Text style={styles.hostName}>{camp.user.name}</Text>
                  </View>
                )}
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
    padding: 20,
    backgroundColor: '#014043',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  categorySection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 10,
  },
  statusButton: {
    backgroundColor: '#00595E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    margin: 5,
  },
  selectedStatusButton: {
    backgroundColor: '#004d4d',
  },
  statusButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  postList: {
    paddingHorizontal: 10,
  },
  postContainer: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  postImage: {
    width: width - 20,
    height: 200,
  },
  postOverlay: {
    position: 'relative',
    height: 100,
  },
  textOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  postTitle: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
  },
  postLocation: {
    color: 'white',
    fontSize: 14,
    marginVertical: 2,
  },
  postCategory: {
    color: 'white',
    fontSize: 14,
    marginVertical: 2,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  hostProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  hostName: {
    color: 'white',
    fontSize: 14,
  },
  loadingText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  errorText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'red',
  },
});

export default MyCamps;
