import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Dimensions, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountOwnerId, setAccountOwnerId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); 
        const response = await axios.get('http://192.168.10.13:5000/api/chat/conversations', {
          headers: {
            Authorization: token, 
          },
        });
        console.log(response.data)
        setConversations(response.data);

        // Retrieve account owner's ID
        const accountOwner = await AsyncStorage.getItem('accountOwnerId');
        setAccountOwnerId(accountOwner);

      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, []);

  const handleConversationPress = (conversationId) => {
    router.push(`ConversationMessages/ConversationMessages?conversationId=${conversationId}`);
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    // You might want to filter conversations based on searchQuery here
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Messages</Text>
      </View>
      <View style={styles.search}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#00796B"
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
        <TouchableOpacity style={styles.searchIconContainer}>
          <Icon name="search" size={20} color="#00796B" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={conversations.filter(conversation =>
          conversation.participants
            .filter(participant => participant.id !== accountOwnerId) // Exclude the account owner
            .some(participant =>
              participant.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          // Filter participants excluding the account owner
          const otherParticipants = item.participants.filter(participant => participant.id !== accountOwnerId);

          // If there are no other participants, return null
          if (otherParticipants.length === 0) return null;

          // Select the first other participant (not the account owner)
          const otherParticipant = otherParticipants[0];

          return (
            <TouchableOpacity style={styles.item} onPress={() => handleConversationPress(item.id)}>
              <View style={styles.itemContent}>
                {otherParticipant.imagesProfile.length > 0 ? (
                  <Image source={{ uri: otherParticipant.imagesProfile[0] }} style={styles.itemImage} />
                ) : (
                  <View style={styles.itemImagePlaceholder} />
                )}
                <Text style={styles.itemText}>{otherParticipant.name}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#00595E', 
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 14,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#00796B',
  },
  searchIconContainer: {
    marginLeft: 10,
  },
  item: {
    marginTop: 15,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 2, // Border width
    borderColor: '#fff', // Border color
  },
  itemImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    marginRight: 10,
    borderWidth: 2, // Border width
    borderColor: '#fff', // Border color
  },
  itemText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default Messages;





