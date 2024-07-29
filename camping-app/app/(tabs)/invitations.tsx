import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';

const invitations = () => {
  const remoteImageUrl = 'https://e0.pxfuel.com/wallpapers/105/23/desktop-wallpaper-compromised-character-gaming-profile-dark-cute-cartoon-boys-thumbnail.jpg';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invitations</Text>
      <View style={styles.card}>
        <Image style={styles.image} source={{ uri: remoteImageUrl }} />
        <Text style={styles.name}>Samir</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Refuse</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.card}>
        <Image style={styles.image} source={{ uri: remoteImageUrl }} />
        <Text style={styles.name}>Lobna</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Refuse</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.card}>
        <Image style={styles.image} source={{ uri: remoteImageUrl }} />
        <Text style={styles.name}>Yosr</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Refuse</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.card}>
        <Image style={styles.image} source={{ uri: remoteImageUrl }} />
        <Text style={styles.name}>Fathi</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Refuse</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default invitations;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00595E', // Updated background color
    alignItems: 'center',
    justifyContent: 'flex-start', // Align items to the top
    padding: 16, // Added padding to ensure spacing
  },
  title: {
    fontSize: 30,
    color: '#fff',
    marginTop: 30, // Adjust margin to position the title properly
    marginBottom: 20, // Space between title and first card
  },
  card: {
    backgroundColor: '#014043', // Updated color
    width: width * 0.9, // Adjust card width to 90% of screen width
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
    color: '#fff', // Added for better visibility on dark background
    marginLeft: 20,
    flex: 1, // Ensure name takes up remaining space
  },
  buttonContainer: {
    flexDirection: 'row', // Arrange buttons in a row
  },
  button: {
    backgroundColor: '#B3492D', // Updated color
    padding: 10,
    borderRadius: 5,
    marginLeft: 10, // Added margin for spacing between buttons
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
