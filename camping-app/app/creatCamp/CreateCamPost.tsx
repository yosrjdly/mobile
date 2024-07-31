import React, {useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Button, Image, Platform } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JWT from 'expo-jwt';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  imagesProfile?: string[]; // Optional, used for campmates
  gender?:string;
  address?:string;
}
const CampingPost = () => {
  const [user, setUser] = useState<User>({ id: "", name: "", email: "", role: "" });
  const [refresh, setRefresh] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [equipment, setEquipment] = useState<string>('');
  const [places, setPlaces] = useState<string>('');
  const [ageCategory, setAgeCategory] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [status, setStatus] = useState<string>('PENDING');
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  const router = useRouter();

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

      if (!result.canceled) {
        const selectedImageUri = result.assets[0].uri;
        setSelectedImage(selectedImageUri);
        setImages(prevImages => [...prevImages, selectedImageUri]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('An unexpected error occurred while picking the image. Please try again.');
    }
  };

  const handlePost = async () => {
    try {
      const formattedStartDate = startDate.toISOString();
      const formattedEndDate = endDate.toISOString();
      const equipmentList = equipment ? equipment.split(',').map(item => item.trim()) : [];

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('location', location);
      formData.append('startDate', formattedStartDate);
      formData.append('endDate', formattedEndDate);
      formData.append('equipment', JSON.stringify(equipmentList));
      formData.append('places', parseInt(places, 10));
      formData.append('ageCategory', ageCategory);  
      formData.append('category', category);  
      formData.append('status', status);  
      formData.append('organizerId', user.id);  


      images.forEach((imageUri) => {
        const fileName = imageUri.split('/').pop();
        const fileType = fileName.includes('.') ? `image/${fileName.split('.').pop()}` : 'image/jpeg';
        formData.append('images', {
          uri: imageUri,
          name: fileName,
          type: fileType,
        });
      });

      const response = await axios.post('http://192.168.10.6:5000/api/camps/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status === 200) {
        alert('Post created successfully');
        router.push('/home');
      } else {
        alert('Error creating post');
      }
    } catch (error) {
      console.error('Error creating post:', error.response?.data || error.message);
      alert('An error occurred while creating the post');
    }
  };

  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisibility(false);
  };

  const handleStartDateConfirm = (date) => {
    setStartDate(date);
    hideStartDatePicker();
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const hideEndDatePicker = () => {
    setEndDatePickerVisibility(false);
  };

  const handleEndDateConfirm = (date) => {
    setEndDate(date);
    hideEndDatePicker();
  };

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
  }, [refresh]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
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
          <Button title="Select Start Date" onPress={showStartDatePicker} />
          <Text>Selected Start Date: {startDate.toLocaleDateString()} {startDate.toLocaleTimeString()}</Text>
          <DateTimePickerModal
            isVisible={isStartDatePickerVisible}
            mode="datetime"
            onConfirm={handleStartDateConfirm}
            onCancel={hideStartDatePicker}
          />
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>End day:</Text>
          <Button title="Select End Date" onPress={showEndDatePicker} />
          <Text>Selected End Date: {endDate.toLocaleDateString()} {endDate.toLocaleTimeString()}</Text>
          <DateTimePickerModal
            isVisible={isEndDatePickerVisible}
            mode="datetime"
            onConfirm={handleEndDateConfirm}
            onCancel={hideEndDatePicker}
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

      <Text style={styles.label}>Minimum Age:</Text>
      <RNPickerSelect
        onValueChange={(value) => setAgeCategory(value)}
        placeholder={{
          label: "Select age category...",
          value: null,
          color: "#ffffff"
        }}
        items={[
          { label: 'ADULT', value: 'ADULT' },
          { label: 'TEEN', value: 'TEEN' },
          { label: 'KIDS', value: 'KIDS' }
        ]}
        style={{
          ...pickerSelectStyles,
          iconContainer: {
            top: Platform.OS === 'ios' ? 10 : 20,
            right: 12,
          },
          placeholder: {
            color: '#ffffff',
            fontSize: 16,
          },
        }}
        value={ageCategory}
        useNativeAndroidPickerStyle={false}
        Icon={() => {
          return <View style={pickerSelectStyles.icon} />;
        }}
      />

 <Text style={styles.label}>Camp Category:</Text>
      <RNPickerSelect
        onValueChange={(value) => setCategory(value)}
        placeholder={{
          label: "Select camp category...",
          value: null,
          color: "#ffffff"
        }}
        items={[
          { label: 'Hiking', value: 'Hiking' },
          { label: 'Kayaking', value: 'Kayaking' },
          { label: 'Fishing', value: 'Fishing' },
          { label: 'Climbing', value: 'Climbing' },
          { label: 'Hitchhiking', value: 'Hitchhiking'},

        ]}
        style={{
          ...pickerSelectStyles,
          iconContainer: {
            top: Platform.OS === 'ios' ? 10 : 20,
            right: 12,
          },
          placeholder: {
            color: '#ffffff',
            fontSize: 16,
          },
        }}
        value={ageCategory}
        useNativeAndroidPickerStyle={false}
        Icon={() => {
          return <View style={pickerSelectStyles.icon} />;
        }}
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
    backgroundColor: '#000',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  clipboardIcon: {
    marginLeft: 10,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#fff',
    borderBottomWidth: 1,
    color: '#fff',
    marginBottom: 15,
  },
  selectedImage: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
  imageUrl: {
    color: '#fff',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
  },
  postButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    color: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 4,
    backgroundColor: '#000',
  },
  inputAndroid: {
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    backgroundColor: '#000',
  },
  icon: {
    top: 20,
    right: 15,
    width: 10,
    height: 10,
  },
});

export default CampingPost;