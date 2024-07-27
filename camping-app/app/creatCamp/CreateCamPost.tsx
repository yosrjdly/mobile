// import React, { useState } from 'react';
// import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
// import { AntDesign, FontAwesome } from '@expo/vector-icons';
// import axios from 'axios';

// const CampingPost = () => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [location, setLocation] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [equipment, setEquipment] = useState('');
//   const [places, setPlaces] = useState('');
//   const [ageCategory, setAgeCategory] = useState('');
//   const [images, setImages] = useState('');

//   const handlePost = async () => {
//     try {
//       // Convert dates to ISO-8601 format
//       const formattedStartDate = new Date(startDate).toISOString();
//       const formattedEndDate = new Date(endDate).toISOString();

//       const response = await axios.post('http://127.0.0.1:5000/api/camps/add', {
//         organizerId: 1, 
//         title,
//         description,
//         location,
//         startDate: formattedStartDate,
//         endDate: formattedEndDate,
//         equipment: equipment.split(',').map(item => item.trim()), // Split and trim equipment string into an array
//         places: parseInt(places, 10),
//         ageCategory,
//         images: images.split(',').map(item => item.trim()), // Split and trim images string into an array
//       });

//       if (response.data.status === 200) {
//         alert('Post created successfully');
//       } else {
//         alert('Error creating post');
//       }
//     } catch (error) {
//       console.error(error);
//       alert('An error occurred while creating the post');
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity>
//           <AntDesign name="arrowleft" size={24} color="white" />
//         </TouchableOpacity>
//         <View style={styles.headerIcons}>
//           <FontAwesome name="search" size={24} color="white" />
//           <FontAwesome name="clipboard" size={24} color="white" style={styles.clipboardIcon} />
//         </View>
//       </View>

//       <Text style={styles.label}>Title :</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="your title ..."
//         placeholderTextColor="#aaa"
//         value={title}
//         onChangeText={setTitle}
//       />

//       <Text style={styles.label}>Description :</Text>
//       <TextInput
//         style={[styles.input, { height: 100 }]}
//         placeholder="more details ..."
//         placeholderTextColor="#aaa"
//         multiline
//         value={description}
//         onChangeText={setDescription}
//       />

//       <View style={styles.row}>
//         <View style={styles.column}>
//           <Text style={styles.label}>First day:</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="month/day/year"
//             placeholderTextColor="#aaa"
//             value={startDate}
//             onChangeText={setStartDate}
//           />
//         </View>
//         <View style={styles.column}>
//           <Text style={styles.label}>Last day:</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="month/day/year"
//             placeholderTextColor="#aaa"
//             value={endDate}
//             onChangeText={setEndDate}
//           />
//         </View>
//       </View>

//       <Text style={styles.label}>Equipment (comma separated):</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Tent, Sleeping Bag, Flashlight ..."
//         placeholderTextColor="#aaa"
//         value={equipment}
//         onChangeText={setEquipment}
//       />

//       <Text style={styles.label}>Image URLs (comma separated):</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="http://example.com/image1.jpg, http://example.com/image2.jpg"
//         placeholderTextColor="#aaa"
//         value={images}
//         onChangeText={setImages}
//       />

//       <Text style={styles.label}>Minimum Age:</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="age . . ."
//         placeholderTextColor="#aaa"
//         value={ageCategory}
//         onChangeText={setAgeCategory}
//       />

//       <View style={styles.row}>
//         <View style={styles.column}>
//           <Text style={styles.label}>Seats :</Text>
//           <TextInput
//             style={styles.input}
//             placeholder=". . ."
//             placeholderTextColor="#aaa"
//             value={places}
//             onChangeText={setPlaces}
//           />
//         </View>
//       </View>

//       <Text style={styles.label}>Destination :</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="location . . ."
//         placeholderTextColor="#aaa"
//         value={location}
//         onChangeText={setLocation}
//       />

//       <TouchableOpacity style={styles.postButton} onPress={handlePost}>
//         <Text style={styles.postButtonText}>Post</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// export default CampingPost;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#00595E',
//     padding: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   headerIcons: {
//     flexDirection: 'row',
//   },
//   clipboardIcon: {
//     marginLeft: 15,
//   },
//   label: {
//     color: 'white',
//     marginBottom: 5,
//   },
//   input: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     borderRadius: 10,
//     padding: 10,
//     color: 'white',
//     marginBottom: 15,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   column: {
//     flex: 1,
//     marginRight: 10,
//   },
//   postButton: {
//     backgroundColor: '#E26645',
//     borderRadius: 10,
//     paddingVertical: 10,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   postButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });
//********************************************************************************************** */
// import React, { useState } from 'react';
// import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Button, Image } from 'react-native';
// import { AntDesign, FontAwesome } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker';
// import axios from 'axios';
// import firebase from 'firebase/app';
// import 'firebase/storage';

// // Initialize Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyBh6Dn7voTgmCNMt94MghtMMnzbLzRoCnY",
//   authDomain: "creat-5d81c.firebaseapp.com",
//   projectId: "creat-5d81c",
//   storageBucket: "creat-5d81c.appspot.com",
//   messagingSenderId: "121134495358",
//   appId: "1:121134495358:web:5589af6b76f910f5c9ca2f",
//   measurementId: "G-JX2RTZDFVB"
// };

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

// const storage = firebase.storage();

// const CampingPost = () => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [location, setLocation] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [equipment, setEquipment] = useState('');
//   const [places, setPlaces] = useState('');
//   const [ageCategory, setAgeCategory] = useState('');
//   const [images, setImages] = useState([]);
//   const [selectedImage, setSelectedImage] = useState(null);

//   const handleImagePick = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.cancelled) {
//       setSelectedImage(result.uri);
//       uploadImage(result.uri);
//     }
//   };

//   const uploadImage = async (uri) => {
//     const response = await fetch(uri);
//     const blob = await response.blob();
//     const filename = uri.split('/').pop();
//     const ref = storage.ref().child(`images/${filename}`);
    
//     ref.put(blob).then(() => {
//       ref.getDownloadURL().then((url) => {
//         setImages(prevImages => [...prevImages, url]);
//       });
//     }).catch(error => {
//       console.error(error);
//       alert('Error uploading image');
//     });
//   };

//   const handlePost = async () => {
//     try {
//       const formattedStartDate = new Date(startDate).toISOString();
//       const formattedEndDate = new Date(endDate).toISOString();

//       const response = await axios.post('http://127.0.0.1:5000/api/camps/add', {
//         organizerId: 1,
//         title,
//         description,
//         location,
//         startDate: formattedStartDate,
//         endDate: formattedEndDate,
//         equipment: equipment.split(',').map(item => item.trim()),
//         places: parseInt(places, 10),
//         ageCategory,
//         images,
//       });

//       if (response.data.status === 200) {
//         alert('Post created successfully');
//       } else {
//         alert('Error creating post');
//       }
//     } catch (error) {
//       console.error(error);
//       alert('An error occurred while creating the post');
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity>
//           <AntDesign name="arrowleft" size={24} color="white" />
//         </TouchableOpacity>
//         <View style={styles.headerIcons}>
//           <FontAwesome name="search" size={24} color="white" />
//           <FontAwesome name="clipboard" size={24} color="white" style={styles.clipboardIcon} />
//         </View>
//       </View>

//       <Text style={styles.label}>Title :</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="your title ..."
//         placeholderTextColor="#aaa"
//         value={title}
//         onChangeText={setTitle}
//       />

//       <Text style={styles.label}>Description :</Text>
//       <TextInput
//         style={[styles.input, { height: 100 }]}
//         placeholder="more details ..."
//         placeholderTextColor="#aaa"
//         multiline
//         value={description}
//         onChangeText={setDescription}
//       />

//       <View style={styles.row}>
//         <View style={styles.column}>
//           <Text style={styles.label}>First day:</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="month/day/year"
//             placeholderTextColor="#aaa"
//             value={startDate}
//             onChangeText={setStartDate}
//           />
//         </View>
//         <View style={styles.column}>
//           <Text style={styles.label}>Last day:</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="month/day/year"
//             placeholderTextColor="#aaa"
//             value={endDate}
//             onChangeText={setEndDate}
//           />
//         </View>
//       </View>

//       <Text style={styles.label}>Equipment (comma separated):</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Tent, Sleeping Bag, Flashlight ..."
//         placeholderTextColor="#aaa"
//         value={equipment}
//         onChangeText={setEquipment}
//       />

//       <Text style={styles.label}>Image Picker:</Text>
//       <Button title="Pick an Image" onPress={handleImagePick} />
//       {selectedImage && <Image source={{ uri: selectedImage }} style={styles.selectedImage} />}
      
//       <Text style={styles.label}>Image URLs:</Text>
//       {images.map((url, index) => (
//         <Text key={index} style={styles.imageUrl}>{url}</Text>
//       ))}

//       <Text style={styles.label}>Minimum Age:</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="age . . ."
//         placeholderTextColor="#aaa"
//         value={ageCategory}
//         onChangeText={setAgeCategory}
//       />

//       <View style={styles.row}>
//         <View style={styles.column}>
//           <Text style={styles.label}>Seats :</Text>
//           <TextInput
//             style={styles.input}
//             placeholder=". . ."
//             placeholderTextColor="#aaa"
//             value={places}
//             onChangeText={setPlaces}
//           />
//         </View>
//       </View>

//       <Text style={styles.label}>Destination :</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="location . . ."
//         placeholderTextColor="#aaa"
//         value={location}
//         onChangeText={setLocation}
//       />

//       <TouchableOpacity style={styles.postButton} onPress={handlePost}>
//         <Text style={styles.postButtonText}>Post</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#00595E',
//     padding: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   headerIcons: {
//     flexDirection: 'row',
//   },
//   clipboardIcon: {
//     marginLeft: 15,
//   },
//   label: {
//     color: 'white',
//     marginBottom: 5,
//   },
//   input: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     borderRadius: 10,
//     padding: 10,
//     color: 'white',
//     marginBottom: 15,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   column: {
//     flex: 1,
//     marginRight: 10,
//   },
//   postButton: {
//     backgroundColor: '#B3492D', // Updated color
//     borderRadius: 10,
//     paddingVertical: 10,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   postButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   selectedImage: {
//     width: 100,
//     height: 100,
//     marginVertical: 10,
//     borderRadius: 10,
//   },
//   imageUrl: {
//     color: 'white',
//     marginBottom: 5,
//   },
// });

// export default CampingPost;
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import axios from 'axios';

const CampingPost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [equipment, setEquipment] = useState('');
  const [places, setPlaces] = useState('');
  const [ageCategory, setAgeCategory] = useState('');
  const [images, setImages] = useState('');

  const handlePost = async () => {
    try {
      // Convert dates to ISO-8601 format
      const formattedStartDate = new Date(startDate).toISOString();
      const formattedEndDate = new Date(endDate).toISOString();

      const response = await axios.post('http://127.0.0.1:5000/api/camps/add', {
        organizerId: 1, 
        title,
        description,
        location,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        equipment: equipment.split(',').map(item => item.trim()), // Split and trim equipment string into an array
        places: parseInt(places, 10),
        ageCategory,
        images: images.split(',').map(item => item.trim()), // Split and trim images string into an array
      });

      if (response.data.status === 200) {
        alert('Post created successfully');
      } else {
        alert('Error creating post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
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

      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the title..."
        placeholderTextColor="#aaa"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Enter details..."
        placeholderTextColor="#aaa"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Start Date:</Text>
          <TextInput
            style={styles.input}
            placeholder="MM/DD/YYYY"
            placeholderTextColor="#aaa"
            value={startDate}
            onChangeText={setStartDate}
          />
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>End Date:</Text>
          <TextInput
            style={styles.input}
            placeholder="MM/DD/YYYY"
            placeholderTextColor="#aaa"
            value={endDate}
            onChangeText={setEndDate}
          />
        </View>
      </View>

      <Text style={styles.label}>Equipment (comma separated):</Text>
      <TextInput
        style={styles.input}
        placeholder="Tent, Sleeping Bag, Flashlight..."
        placeholderTextColor="#aaa"
        value={equipment}
        onChangeText={setEquipment}
      />

      <Text style={styles.label}>Image URLs (comma separated):</Text>
      <TextInput
        style={styles.input}
        placeholder="http://example.com/image1.jpg, http://example.com/image2.jpg"
        placeholderTextColor="#aaa"
        value={images}
        onChangeText={setImages}
      />

      <Text style={styles.label}>Minimum Age:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter minimum age..."
        placeholderTextColor="#aaa"
        value={ageCategory}
        onChangeText={setAgeCategory}
      />

      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Seats:</Text>
          <TextInput
            style={styles.input}
            placeholder="Number of seats..."
            placeholderTextColor="#aaa"
            value={places}
            onChangeText={setPlaces}
          />
        </View>
      </View>

      <Text style={styles.label}>Destination:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter location..."
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
    backgroundColor: '#E26645',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  postButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CampingPost;

