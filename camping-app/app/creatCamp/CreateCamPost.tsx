import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Button, Image } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { storage } from '../../firebaseConfig'; // Import storage from the separate Firebase config file
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Define the types for state variables
type State = {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  equipment: string;
  places: string;
  ageCategory: string;
  images: string[];
  selectedImage: string | null;
};

const CampingPost: React.FC = () => {
  const [state, setState] = useState<State>({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    equipment: '',
    places: '',
    ageCategory: '',
    images: [],
    selectedImage: null,
  });

  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to choose an image.');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0 && result.assets[0].uri) {
        const selectedImageUri = result.assets[0].uri;
        setState(prevState => ({ ...prevState, selectedImage: selectedImageUri }));
        uploadImage(selectedImageUri);
      } else {
        console.error('Image selection failed: No valid URI found');
        alert('There was an error selecting the image. Please try again.');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('An unexpected error occurred while picking the image. Please try again.');
    }
  };

  const uploadImage = async (uri: string) => {
    if (!uri) {
      console.error('No image selected');
      return;
    }

    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = uri.split('/').pop();
      if (!filename) {
        throw new Error('Filename is not found');
      }

      const imageRef = ref(storage, `images/${filename}`);
      const uploadTask = await uploadBytes(imageRef, blob);

      // Handle successful uploads on completion
      const downloadURL = await getDownloadURL(uploadTask.ref);
      setState(prevState => ({ ...prevState, images: [...prevState.images, downloadURL] }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('An error occurred while uploading the image. Please try again.');
    }
  };

  const handlePost = async () => {
    try {
      const formattedStartDate = new Date(state.startDate).toISOString();
      const formattedEndDate = new Date(state.endDate).toISOString();

      const equipmentList = state.equipment ? state.equipment.split(',').map(item => item.trim()) : [];
      const imageUrls = state.images.length > 0 ? state.images.map(image => image.trim()) : [];

      const response = await axios.post('http:// 192.168.10.4:5000/api/camps/add', {
        organizerId: 1,
        title: state.title,
        description: state.description,
        location: state.location,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        equipment: equipmentList,
        places: parseInt(state.places, 10),
        ageCategory: state.ageCategory,
        images: imageUrls,
      });

      if (response.data.status === 200) {
        alert('Post created successfully');
      } else {
        alert('Error creating post');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while creating the post');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          <FontAwesome name="search" size={24} color="white" />
          <FontAwesome name="clipboard" size={24} color="white" style={styles.clipboardIcon} />
        </View>
      </View>

      <Text style={styles.label}>Title :</Text>
      <TextInput
        style={styles.input}
        placeholder="your title ..."
        placeholderTextColor="#aaa"
        value={state.title}
        onChangeText={(text) => setState(prevState => ({ ...prevState, title: text }))}
      />

      <Text style={styles.label}>Description :</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="more details ..."
        placeholderTextColor="#aaa"
        multiline
        value={state.description}
        onChangeText={(text) => setState(prevState => ({ ...prevState, description: text }))}
      />

      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>First day:</Text>
          <TextInput
            style={styles.input}
            placeholder="month/day/year"
            placeholderTextColor="#aaa"
            value={state.startDate}
            onChangeText={(text) => setState(prevState => ({ ...prevState, startDate: text }))}
          />
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Last day:</Text>
          <TextInput
            style={styles.input}
            placeholder="month/day/year"
            placeholderTextColor="#aaa"
            value={state.endDate}
            onChangeText={(text) => setState(prevState => ({ ...prevState, endDate: text }))}
          />
        </View>
      </View>

      <Text style={styles.label}>Equipment (comma separated):</Text>
      <TextInput
        style={styles.input}
        placeholder="Tent, Sleeping Bag, Flashlight ..."
        placeholderTextColor="#aaa"
        value={state.equipment}
        onChangeText={(text) => setState(prevState => ({ ...prevState, equipment: text }))}
      />

      <Text style={styles.label}>Image Picker:</Text>
      <Button title="Pick an Image" onPress={handleImagePick} />
      {state.selectedImage && <Image source={{ uri: state.selectedImage }} style={styles.selectedImage} />}

      <Text style={styles.label}>Image URLs:</Text>
      {state.images.map((url, index) => (
        <Text key={index} style={styles.imageUrl}>{url}</Text>
      ))}

      <Text style={styles.label}>Minimum Age:</Text>
      <TextInput
        style={styles.input}
        placeholder="age . . ."
        placeholderTextColor="#aaa"
        value={state.ageCategory}
        onChangeText={(text) => setState(prevState => ({ ...prevState, ageCategory: text }))}
      />

      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Seats :</Text>
          <TextInput
            style={styles.input}
            placeholder=". . ."
            placeholderTextColor="#aaa"
            value={state.places}
            onChangeText={(text) => setState(prevState => ({ ...prevState, places: text }))}
          />
        </View>
      </View>

      <Text style={styles.label}>Destination :</Text>
      <TextInput
        style={styles.input}
        placeholder="location . . ."
        placeholderTextColor="#aaa"
        value={state.location}
        onChangeText={(text) => setState(prevState => ({ ...prevState, location: text }))}
      />

      <TouchableOpacity style={styles.postButton} onPress={handlePost}>
        <Text style={styles.postButtonText}>Post</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00595E',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  clipboardIcon: {
    marginLeft: 15,
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: 'white',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
  selectedImage: {
    width: 100,
    height: 100,
    marginVertical: 10,
    borderRadius: 10,
  },
  imageUrl: {
    color: 'white',
    marginBottom: 5,
  },
  postButton: {
    backgroundColor: '#004D40',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  postButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CampingPost;
