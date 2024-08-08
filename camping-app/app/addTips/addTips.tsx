import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, ScrollView, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JWT from 'expo-jwt';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const addTips = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Experiences');
  const [filterCategory, setFilterCategory] = useState('');
  const [user, setUser] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

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
        allowsMultipleSelection: true,
      });

      if (!result.canceled) {
        const uris = result.assets.map(asset => asset.uri);
        setSelectedImages(uris);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('An unexpected error occurred while picking the image. Please try again.');
    }
  };

  const handlePost = async () => {
    if (!title || !content || !location || !category || !filterCategory || !user.id || selectedImages.length === 0) {
      Alert.alert('All fields are required.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('location', location);
      formData.append('category', category);
      formData.append('filterCategory', filterCategory);
      formData.append('userId', user.id);

      selectedImages.forEach((imageUri, index) => {
        const fileName = imageUri.split('/').pop();
        const fileType = fileName.includes('.') ? `image/${fileName.split('.').pop()}` : 'image/jpeg';
        formData.append('imagesUrl', {
          uri: imageUri,
          name: fileName,
          type: fileType,
        });
      });

      const response = await axios.post('http://192.168.10.4:5000/api/experienceTip/add', formData, {

        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status === 200) {
        Alert.alert('Post created successfully');
        // Optionally, navigate to another screen
      } else {
        Alert.alert('Error creating post');
      }
    } catch (error) {
      console.error('Error occurred while creating the post:', error);
      alert('An error occurred while creating the post');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter title"
      />

      <Text style={styles.label}>Content</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={content}
        onChangeText={setContent}
        placeholder="Enter content"
        multiline
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Enter location"
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Experiences" value="Experiences" />
          <Picker.Item label="Tips" value="Tips" />
        </Picker>
      </View>

      <Text style={styles.label}>Filter Category</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={filterCategory}
          onValueChange={(itemValue) => setFilterCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Shelter and Sleeping" value="ShelterAndSleeping" />
          <Picker.Item label="Cooking and Eating" value="CookingAndEating" />
          <Picker.Item label="Clothing and Footwear" value="ClothingAndFootwear" />
          <Picker.Item label="Navigation and Safety" value="NavigationAndSafety" />
          <Picker.Item label="Personal Items and Comfort" value="PersonalItemsAndComfort" />
          <Picker.Item label="Miscellaneous" value="Miscellaneous" />
          <Picker.Item label="Optional but Useful" value="OptionalButUseful" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePick}>
        <Text style={styles.imagePickerButtonText}>Pick images</Text>
      </TouchableOpacity>

      {selectedImages.length > 0 && (
        <View style={styles.imageContainer}>
          {selectedImages.map((imageUri, index) => (
            <Image key={index} source={{ uri: imageUri }} style={styles.selectedImage} />
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handlePost}>
        <Text style={styles.buttonText}>Post</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
    color: '#333',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  multilineInput: {
    height: 100,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  picker: {
    height: 40,
    color: '#333',
  },
  imagePickerButton: {
    backgroundColor: '#6c63ff',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 10,
  },
  imagePickerButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  selectedImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default addTips;
