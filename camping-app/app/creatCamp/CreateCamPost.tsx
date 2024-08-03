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
  imagesProfile?: string[]; 
  gender?: string;
  address?: string;
}
const CampingPost = () => {
  const [skip, setSkip] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(1);
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
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [click,setClick]=useState<boolean>(false)
  const router = useRouter();
  
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
    
    if (!result.canceled) {
      console.log('Image picker result:', result); // Log the entire result object for debugging
      setClick(!click)

      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        const selectedImageUri = result.assets[0].uri;
        setImages(prevImages => [...prevImages, selectedImageUri]);
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
  

console.log(images);


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
          router.push('/(tabs)/home')
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
    if(currentStep===2&&skip>0){
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
const back=()=>{
  if(currentStep===1){
    setCurrentStep(currentStep);
  }if(currentStep===2){
    setCurrentStep(currentStep - 1);

  }if(currentStep===3){
    setCurrentStep(currentStep - 1);

  }}

  

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
      </View>
      <Modal visible={currentStep === 1} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.replace('home')}>
        <AntDesign name="arrowleft" size={24} color="white" />
      </TouchableOpacity>
          <Text style={styles.popUPtitle}>Add Camp</Text>
            <Text style={styles.titleOfInput}> Title :</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="title..."
              value={title}
              onChangeText={setTitle}
            />
            <Text style={styles.destinationTitle}>Destination :</Text>
                  <TextInput
                    style={styles.destinationInput}
                    placeholder="location . . ."
                    placeholderTextColor="#aaa"
                    value={location}
                    onChangeText={setLocation}
                  />
             <Text style={styles.descriptionTitle}>Description :</Text>
      <TextInput
        style={[styles.descriptionInput, ]}
        placeholder="more details ..."
        placeholderTextColor="#aaa"
        multiline
        value={description}
        onChangeText={setDescription}
      />
      <Text style={styles.minimumAgeTitle}>Minimum Age:</Text>
      <RNPickerSelect
        onValueChange={(value) => setAgeCategory(value)}
        placeholder={{
          label: "Select age category",
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
      <Text style={styles.categoryTitle}>Camp Category:</Text>
      <RNPickerSelect
        onValueChange={(value) => setCategory(value)}
        placeholder={{
          label: "Select camp category",
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


            <TouchableOpacity style={styles.postButton} onPress={handleNext}>
              <Text style={styles.postButtonText}>Next</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postButton}  onPress={() => router.replace('home')}>
              <Text style={styles.postButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={currentStep === 2} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <TouchableOpacity style={styles.backButton} onPress={back}>
        <AntDesign name="arrowleft" size={24} color="white" />
      </TouchableOpacity>
          <Text style={styles.titleOfInput}>Image Picker:</Text>
        <Button   title="Pick an Image" 
      onPress={handleImagePick}  
      color={ '#B3492D'}
       />
          {images.map((image, index) => (
        <Image
          key={index}
          source={{ uri: image }}
          style={styles.selectedImage}
        />
      ))}
          <View  style={styles.buttonRow}> 
            <TouchableOpacity style={styles.skipButton} onPress={handleNext} color={click ? '#B3492D' : '#ccc'} >
              <Text style={styles.postButtonText} >skip</Text>
            </TouchableOpacity>
            <TouchableOpacity
        style={[styles.skipButton, { backgroundColor: click ? '#B3492D' : '#ccc' }]}
        onPress={click ? handleNext : null} // Only set onPress if click is true
        disabled={!click} // Disable the button if click is false
      >
        <Text style={styles.postButtonText}>next</Text>
      </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={currentStep === 3} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <TouchableOpacity style={styles.backButton} onPress={back}>
        <AntDesign name="arrowleft" size={24} color="white" />
      </TouchableOpacity>
          <Text style={styles.destinationTitle}>Equipment (comma separated):</Text>
      <TextInput
        style={styles.input}
        placeholder="Tent, Sleeping Bag, Flashlight ..."
        placeholderTextColor="#aaa"
        value={equipment}
        onChangeText={setEquipment}
      />
          <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.destinationTitle}>Seats :</Text>
          <TextInput
           style={styles.numberInput} // Apply the specific style for number input
           placeholder=". . ."
           placeholderTextColor="#aaa"
           value={places}
           onChangeText={setPlaces}
           keyboardType="numeric" // Ensure only numeric input is allowed
         
          />
        </View>
      </View>
          <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.destinationTitle}>First day:</Text>
          <Button title="Select Start Date" onPress={showStartDatePicker} color={'#B3492D'}/>
          <DateTimePickerModal
            isVisible={isStartDatePickerVisible}
            mode="datetime"
            onConfirm={handleStartDateConfirm}
            onCancel={hideStartDatePicker}
            buttonTextColorIOS='black'
          />
        </View>
        <View style={styles.column}>
          <Text style={styles.destinationTitle}>End day:</Text>
          <Button title="Select End Date" onPress={showEndDatePicker}  color={'#B3492D'} />
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
  popUPtitle:{
    color: 'white', // Text color
    fontSize: 30, // Font size (adjust based on screen size)
    fontWeight: 'bold', // Make the title bold
    marginBottom: 10, // Space below the title
    paddingHorizontal: 10, // Space on the left and right
    textAlign: 'left', // Center the text
    width: '100%', // Take full width of the container
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
  Button:{
color:'#00595E'
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
  postButtonText: {
    color: 'white',
    fontSize: 18, // Font size (adjust based on screen size)
    fontWeight: 'bold',
  },
   selectedImage: {
  width: 100, // Fixed width for each image
  height: 100, // Fixed height for each image
  marginRight: 10, 
  marginVertical: 5,
  borderRadius: 5,
  padding: 10,
  },
  titleOfInput:{
    color: 'white', // Text color
    fontSize: 20, // Font size (adjust based on screen size)
    fontWeight: 'bold', // Make the title bold
    marginBottom: 10, // Space below the title
    paddingHorizontal: 10, // Space on the left and right
    textAlign: 'left', // Center the text
    width: '100%', // Take full width of the container
  }, 
  titleInput:{
    width: '100%', // Takes up half of the container's width
    alignSelf: 'flex-start', // Aligns the input to the start (left) of the container
    marginBottom: 15, // Adds space below the input
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent background
    borderRadius: 10, // Rounded corners
    padding: 10, // Padding inside the input
    color: 'white', // Text color
  },
  destinationInput:{
    width: '100%', // Takes up half of the container's width
    alignSelf: 'flex-start', // Aligns the input to the start (left) of the container
    marginBottom: 15, // Adds space below the input
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent background
    borderRadius: 10, // Rounded corners
    padding: 10, // Padding inside the input
    color: 'white', // Text color
  },
  destinationTitle:{
    color: 'white', // Text color
    fontSize: 18, // Font size (adjust based on screen size)
    fontWeight: 'bold', // Make the title bold
    marginBottom: 10, // Space below the title
    paddingHorizontal: 10, // Space on the left and right
    textAlign: 'left', // Center the text
    width: '100%', // Take full widt

  },
  descriptionInput:{
    width: '100%', // Takes up half of the container's width
    height:'15%',
    alignSelf: 'flex-start', // Aligns the input to the start (left) of the container
    marginBottom: 15, // Adds space below the input
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent background
    borderRadius: 10, // Rounded corners
    padding: 10, // Padding inside the input
    color: 'white', // Text color
  },
  descriptionTitle:{
    color: 'white', // Text color
    fontSize: 18, // Font size (adjust based on screen size)
    fontWeight: 'bold', // Make the title bold
    marginBottom: 10, // Space below the title
    paddingHorizontal: 10, // Space on the left and right
    textAlign: 'left', // Center the text
    width: '100%', // Take full widt
  },
  minimumAgeTitle:{
    color: 'white', // Text color
    fontSize: 18, // Font size (adjust based on screen size)
    fontWeight: 'bold', // Make the title bold
    marginBottom: 10, // Space below the title
    paddingHorizontal: 10, // Space on the left and right
    textAlign: 'left', // Center the text
    width: '100%', // Take full widt
  },
  categoryTitle:{
    color: 'white', // Text color
    fontSize: 18, // Font size (adjust based on screen size)
    fontWeight: 'bold', // Make the title bold
    marginBottom: 10, // Space below the title
    paddingHorizontal: 10, // Space on the left and right
    textAlign: 'left', // Center the text
    width: '100%', // Take full widt
  },postButton:{
    backgroundColor: '#B3492D',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
    width: '100%', // Take full widt
  },buttonRow: {
    flexDirection: 'row', // Align children horizontally
    justifyContent: 'space-between', // Space between buttons
    marginTop: 20,
  },
  nextButton:{
    backgroundColor: '#B3492D',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    width: '48%', // Takes up almost half of the container's width
  },skipButton:{
    backgroundColor: '#B3492D',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    width: '48%', // Takes up almost half of the container's width

  },numberInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent background
    borderRadius: 10, // Rounded corners
    padding: 10, // Padding inside the input field
    color: 'white', // Text color
    marginBottom: 15, // Space below the input
    textAlign: 'center', // Center align text
  }, backButton: {
    position: 'absolute',
    top: 5, // Adjust as needed to move away from the top edge
    left: 10, // Adjust as needed to move away from the left edge
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
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderColor: '#fff',
    borderRadius: 15,
    backgroundColor: 'rgba(55, 55, 55, 0.8)', // Semi-transparent background
  },
  icon: {
    top: 20,
    right: 15,
    width: 10,
    height: 10,
  },
});

export default CampingPost;
