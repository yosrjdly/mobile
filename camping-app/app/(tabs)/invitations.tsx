import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JWT from 'expo-jwt';

const Invitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState(null);
  const [responseStatus, setResponseStatus] = useState('');

  // Fetch user details from AsyncStorage
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await AsyncStorage.getItem('token');
        if (data) {
          const token = data.startsWith('Bearer ') ? data.replace('Bearer ', '') : data;
          const key = 'mySuperSecretPrivateKey';

          try {
            const decodedToken = JWT.decode(token, key);
            if (decodedToken) {
              setUser({
                id: decodedToken.id || '',
                name: decodedToken.name || '',
                email: decodedToken.email || '',
                imagesProfile: decodedToken.imagesProfile,
                role: decodedToken.role || '',
              });
            } else {
              console.error('Failed to decode token');
            }
          } catch (decodeError) {
            console.error('Error decoding token:', decodeError);
          }
        } else {
          console.error('Token not found in AsyncStorage');
        }
      } catch (storageError) {
        console.error('Failed to fetch token from AsyncStorage:', storageError);
      }
    };

    fetchUser();
  }, []);
console.log("user id ", user)
  // Fetch invitations once the user is available
console.log("invitations " ,invitations)

  useEffect(() => {
    const fetchInvitations = async () => {
      if (user) {
        try {
          const response = await axios.get(`http://192.168.10.13:5000/api/invitations/received/${user.id}`);
          setInvitations(response.data);
        } catch (error) {
          console.error('Error fetching invitations:', error);
        }
      }
    };

    fetchInvitations();
  }, [user]); // Dependency on user to ensure invitations are fetched after user is set

  const handleResponse = async (invitationId, status) => {
    try {
      await axios.post(`http://192.168.1.51:5000/api/invitations/respond`, {
        invitationId,
        status,
      });
      // Optionally, update the state to reflect the change without a full refresh
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
      setModalVisible(false); // Close the modal after responding
    } catch (error) {
      console.error('Error responding to invitation:', error);
    }
  };

  const openModal = (invitation, status) => {
    setSelectedInvitation(invitation);
    setResponseStatus(status);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invitations</Text>
      {invitations.map(invitation => (
        <View key={invitation.id} style={styles.card}>
          <Image style={styles.image} source={{ uri: invitation.sender.imagesProfile[0]
 }} />
          <Text style={styles.name}>{invitation.sender.name}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => openModal(invitation, 'Accepted')}>
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => openModal(invitation, 'Declined')}>
              <Text style={styles.buttonText}>Refuse</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm {responseStatus}</Text>
            <Text style={styles.modalMessage}>Are you sure you want to {responseStatus.toLowerCase()} this invitation?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={() => handleResponse(selectedInvitation.id, responseStatus)}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#B3492D' }]} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Invitations;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00595E',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
  },
  title: {
    fontSize: 30,
    color: '#fff',
    marginTop: 30,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#014043',
    width: width * 0.9,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  name: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 20,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#B3492D',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
  },
  modalButton: {
    backgroundColor: '#00595E',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
