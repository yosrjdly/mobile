import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Button, Image, Platform, Modal } from 'react-native';
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
  gender?: string;
  address?: string;
}
const CampingPost = () => {
  const [skip, setSkip] = useState<boolean>(true)
  const [currentStep, setCurrentStep] = useState<number>(3);
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
            } else {
              alert('Error creating post');
            }
    } catch (error) {
      console.error(error);
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

// const defaulImg=()=>{
//   if(category==='Hiking'){
//     setImages('')
//   }
//   if(category==='Kayaking'){
//     setImages('')
//   } if(category==='Fishing'){
//     setImages('')
//   } if(category==='Climbing'){
//     setImages('')
//   }if(category==='Hitchhiking'){
//     setImages('')
//   }
// }

  const handleNext = () => {
    //first Popup

    if (currentStep === 1 && !title) {
      alert("Please enter a title.");
      return;
    }
    if (currentStep === 1 && !description) {
      alert("Please enter a description for the post.");
      return;
    }
    if (currentStep === 1 && !location) {
      alert("Please enter a location for the post.");
      return;
    }
    if (currentStep === 1 && !ageCategory) {
      alert("Please enter an age category for the post.");
      return;
    }
    if (currentStep === 1 && !category) {
      alert("Please enter a category for the post.");
      return;
    }
    // second Popup
    if (currentStep === 2 && !images ) {
      alert("Please enter your images.");
      return;
    }
    console.log(images,'rrrrrrrrrrrrrrrr');
    if(currentStep===2&&skip!=true){
      currentStep+1
    }

    //third Popup

    if (currentStep === 3 && !places) {
      alert("Please enter the place of the camp.");
      return;
    } if (currentStep === 3 && !equipment) {
      alert("Please enter equipment neded for the camp .");
      return;
    } if (currentStep === 3 && !startDate) {
      alert("Please enter a startDate.");
      return;
    } if (currentStep === 3 && !endDate) {
      alert("Please enter a endDate.");
      return;
    }
    setCurrentStep(currentStep + 1);
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
      <Modal visible={currentStep === 1} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <Text style={styles.label}>Step 1:</Text>
            <Text style={styles.label}> Enter Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
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
      <Text style={styles.label}>Minimum Age:</Text>
      <TextInput
        style={styles.input}
        placeholder="age . . ."
        placeholderTextColor="#aaa"
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
          { label: 'Hitchhiking', value: 'Hitchhiking' },

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
        value={category}
        useNativeAndroidPickerStyle={false}
        Icon={() => {
          return <View style={pickerSelectStyles.icon} />;
        }}
      />

<Text style={styles.label}>Destination :</Text>
      <TextInput
        style={styles.input}
        placeholder="location . . ."
        placeholderTextColor="#aaa"
        value={location}
        onChangeText={setLocation}
      />

            <TouchableOpacity style={styles.postButton} onPress={handleNext}>
              <Text style={styles.postButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={currentStep === 2} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <Text style={styles.label}>Image Picker:</Text>
      <Button title="Pick an Image" onPress={handleImagePick} />
      {selectedImage && <Image source={{ uri: selectedImage }} style={styles.selectedImage} />}
            <TouchableOpacity style={styles.postButton} onPress={handleNext}>
              <Text style={styles.postButtonText}>Next</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postButton} onPress={handleNext}>
              <Text style={styles.postButtonText}>skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={currentStep === 3} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          
          <Text style={styles.label}>Equipment (comma separated):</Text>
      <TextInput
        style={styles.input}
        placeholder="Tent, Sleeping Bag, Flashlight ..."
        placeholderTextColor="#aaa"
        value={equipment}
        onChangeText={setEquipment}
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
          <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>First day:</Text>
          <Button title="Select Start Date" onPress={showStartDatePicker} />
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
          <DateTimePickerModal
            isVisible={isEndDatePickerVisible}
            mode="datetime"
            onConfirm={handleEndDateConfirm}
            onCancel={hideEndDatePicker}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.postButton} onPress={handlePost}>
        <Text style={styles.postButtonText}>Post</Text>
      </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#00595E',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
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
    backgroundColor: '#B3492D',
    padding: 15,
    borderRadius: 5,
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
