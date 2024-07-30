import { StyleSheet, Text, View, Image, TextInput } from 'react-native';
import React from 'react';

const messages = () => {
  const remoteImageUrl = 'https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg';
  const searchIconUrl = 'https://example.com/search.png'; // Replace with your search icon URL

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      
      <View style={styles.search}>
        <Image source={{ uri: searchIconUrl }} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Look For ..."
          placeholderTextColor="#B0BEC5"
        />
      </View>

      <View style={styles.message}>
        <Image source={{ uri: remoteImageUrl }} style={styles.profile} />
        <View style={styles.messageContent}>
          <Text style={styles.name}>Lobna</Text>
          <Text style={styles.messageText}>Lobna sent a message.</Text>
        </View>
        <Text style={styles.time}>12:20</Text>
      </View>

      <View style={styles.message}>
        <Image source={{ uri: remoteImageUrl }} style={styles.profile} />
        <View style={styles.messageContent}>
          <Text style={styles.name}>Samir</Text>
          <Text style={styles.messageText}>Samir sent a message.</Text>
        </View>
        <Text style={styles.time}>2:20</Text>
      </View>

      <View style={styles.message}>
        <Image source={{ uri: remoteImageUrl }} style={styles.profile} />
        <View style={styles.messageContent}>
          <Text style={styles.name}>Fathi</Text>
          <Text style={styles.messageText}>Fathi sent a message.</Text>
        </View>
        <Text style={styles.time}>3:20</Text>
      </View>

      <View style={styles.message}>
        <Image source={{ uri: remoteImageUrl }} style={styles.profile} />
        <View style={styles.messageContent}>
          <Text style={styles.name}>Yassine</Text>
          <Text style={styles.messageText}>Yassine sent a message.</Text>
        </View>
        <Text style={styles.time}>10:20</Text>
      </View>

      <View style={styles.message}>
        <Image source={{ uri: remoteImageUrl }} style={styles.profile} />
        <View style={styles.messageContent}>
          <Text style={styles.name}>Yosri</Text>
          <Text style={styles.messageText}>Yosri: Nice camp.</Text>
        </View>
        <Text style={styles.time}>8:00</Text>
      </View>
    </View>
  );
}

export default messages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00595E', // Updated background color
    padding: 16,
    alignItems: 'center', // Center content horizontally
    justifyContent: 'flex-start', // Align items to the top
  },
  title: {
    fontSize: 30,
    color: '#fff',
    marginVertical: 20, // Space between title and other elements
    textAlign: 'center', // Center text horizontally
  },
  search: {
    backgroundColor: '#014043', // Updated color
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    width: '100%', // Ensure search bar spans the width
    maxWidth: 400, // Optional: limit width for larger screens
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    padding: 8,
  },
  message: {
    backgroundColor: '#014043', // Updated color
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    width: '100%', // Ensure message spans the width
    maxWidth: 400, // Optional: limit width for larger screens
  },
  profile: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  messageContent: {
    flex: 1,
  },
  name: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 16,
  },
  messageText: {
    color: '#B0BEC5',
    fontSize: 14,
  },
  time: {
    color: '#B0BEC5',
    fontSize: 12,
  },
});
