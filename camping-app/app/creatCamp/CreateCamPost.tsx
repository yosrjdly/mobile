import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Button, Image } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { storage } from '../../firebaseConfig'; // Import storage from the separate Firebase config file
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CampingPost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [equipment, setEquipment] = useState('');
  const [places, setPlaces] = useState('');
  const [ageCategory, setAgeCategory] = useState('');
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);


const handleImagePick = async () => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll  permissions to choose an image.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      console.log('Image picker result:', result); // Log the entire result object for debugging

      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        const selectedImageUri = result.assets[0].uri;
        setSelectedImage(selectedImageUri);
        uploadImage(selectedImageUri);
      } else {
        console.error('Image selection failed: No valid URI found');
        alert('There was an error selecting the image. Please try again.');
      }
    }
  } catch (error) {
    console.error('Error picking image:', error);
    alert('An unexpected error occurred while picking the image. Please try again.');
  }
};
const uploadImage = async (uri) => {
  

  if (!uri) {
    console.error('No image selected');
    return;
  }

  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = uri.split('/').pop();
    const ref = storage.ref().child(`images/${filename}`);

    const uploadTask = await ref.put(blob);

    // Handle upload progress if needed
    uploadTask.on('state_changed',
      (snapshot) => {
        // Handle progress
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error('Error uploading image:', error);
      },
      () => {
        // Handle successful uploads on completion   

        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          setImages(prevImages => [...prevImages, downloadURL]);
        });
      }
    );
  } catch (error) {
    console.error('Error uploading image:', error);
    console.log('Error uploading image:', error.message, error.code, error.stack);
  }
};



  const handlePost = async () => {
    try {
      const formattedStartDate = new Date(startDate).toISOString();
      const formattedEndDate = new Date(endDate).toISOString();
  
      const equipmentList = equipment ? equipment.split(',').map(item => item.trim()) : [];
      const imageUrls = images.length > 0 ? images.map(image => image.trim()) : []; // Assuming images is an array of image URLs
  
      const response = await axios.post('http://192.168.10.20:5000/api/camps/add', {
        organizerId: 1,
        title,
        description,
        location,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        equipment: equipmentList,
        places: parseInt(places, 10),
        ageCategory,
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
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description :</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="more details ..."
        placeholderTextColor="#aaa"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>First day:</Text>
          <TextInput
            style={styles.input}
            placeholder="month/day/year"
            placeholderTextColor="#aaa"
            value={startDate}
            onChangeText={setStartDate}
          />
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Last day:</Text>
          <TextInput
            style={styles.input}
            placeholder="month/day/year"
            placeholderTextColor="#aaa"
            value={endDate}
            onChangeText={setEndDate}
          />
        </View>
      </View>

      <Text style={styles.label}>Equipment (comma separated):</Text>
      <TextInput
        style={styles.input}
        placeholder="Tent, Sleeping Bag, Flashlight ..."
        placeholderTextColor="#aaa"
        value={equipment}
        onChangeText={setEquipment}
      />

      <Text style={styles.label}>Image Picker:</Text>
      <Button title="Pick an Image" onPress={handleImagePick} />
      {selectedImage && <Image source={{ uri: selectedImage }} style={styles.selectedImage} />}

      <Text style={styles.label}>Image URLs:</Text>
      {images.map((url, index) => (
        <Text key={index} style={styles.imageUrl}>{url}</Text>
      ))}

      <Text style={styles.label}>Minimum Age:</Text>
      <TextInput
        style={styles.input}
        placeholder="age . . ."
        placeholderTextColor="#aaa"
        value={ageCategory}
        onChangeText={setAgeCategory}
      />

      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Seats :</Text>
          <TextInput
            style={styles.input}
            placeholder=". . ."
            placeholderTextColor="#aaa"
            value={places}
            onChangeText={setPlaces}
          />
        </View>
      </View>

      <Text style={styles.label}>Destination :</Text>
      <TextInput
        style={styles.input}
        placeholder="location . . ."
        placeholderTextColor="#aaa"
        value={location}
        onChangeText={setLocation}
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
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 10,
    color: 'white',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    marginRight: 10,
  },
  postButton: {
    backgroundColor: '#B3492D', // Updated color
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  postButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
});

export default CampingPost;
