import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { AntDesign } from '@expo/vector-icons'; // Import AntDesign for icons

const EditProfile = () => {
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('');
  const [showInterests, setShowInterests] = useState(false);
  
  const handleInterestPress = (interest) => {
    setInterest(interest);
    setShowInterests(false);
  };

  const handleProfileImagePress = () => {
    // Handle profile image update logic here
    console.log("Profile image clicked");
  };

  const handleEditNamePress = () => {
    // Handle edit name logic here
    console.log("Edit name clicked");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        {/* Removed icons */}
      </View>
      <View style={styles.profilePicture}>
        <TouchableOpacity onPress={handleProfileImagePress} style={styles.profileImageContainer}>
          <View style={styles.profileImage} />
          <View style={styles.cameraIcon}>
            <AntDesign name="camera" size={24} color="white" />
          </View>
        </TouchableOpacity>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>Lobna Youssfi</Text>
          <TouchableOpacity onPress={handleEditNamePress} style={styles.editIcon}>
            <AntDesign name="edit" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.info}>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Interest:</Text>
          <TouchableOpacity onPress={() => setShowInterests(!showInterests)} style={styles.interestInput}>
            <Text style={styles.interestText}>{interest || 'Add your interest...'}</Text>
            <AntDesign name={showInterests ? 'caretup' : 'caretdown'} size={16} color="white" />
          </TouchableOpacity>
          {showInterests && (
            <View style={styles.interestOptions}>
              {['Hiking', 'Swimming', 'Kayaking', 'Add interest'].map(option => (
                <TouchableOpacity 
                  key={option} 
                  onPress={() => handleInterestPress(option)} 
                  style={styles.interestOption}
                >
                  <Text style={styles.interestOptionText}>{option}</Text>
                  {option === 'Add interest' && <AntDesign name="pluscircle" size={16} color="white" />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        {[
          { label: 'Age', value: age, setter: setAge, placeholder: 'Enter your age', keyboardType: 'numeric' },
          { label: 'Location', value: location, setter: setLocation, placeholder: 'Enter your location' },
          { label: 'Bio', value: bio, setter: setBio, placeholder: 'Tell us about yourself', multiline: true, numberOfLines: 3 },
          { label: 'Phone', value: phone, setter: setPhone, placeholder: 'Enter your phone number', keyboardType: 'phone-pad' },
        ].map(({ label, value, setter, placeholder, keyboardType, multiline, numberOfLines }) => (
          <View key={label} style={styles.inputRow}>
            <Text style={styles.label}>{label}:</Text>
            <TextInput
              style={[styles.input, multiline && styles.bioInput]}
              value={value}
              onChangeText={setter}
              placeholder={placeholder}
              placeholderTextColor="white" // Set placeholder text color here
              keyboardType={keyboardType}
              multiline={multiline}
              numberOfLines={numberOfLines}
            />
          </View>
        ))}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#00595E', // Updated background color
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profilePicture: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: '#90caf9',
  },
  cameraIcon: {
    position: 'relative',
    bottom: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10, // Add margin to separate from profile picture
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 10, // Space between name and icon
  },
  editIcon: {
    backgroundColor: '#00595E', // Optional: Adjust icon background color if needed
    padding: 5,
    borderRadius: 50,
    marginRight:-25
  },
  info: {
    marginTop: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: 'white',
    marginRight: 10,
    width: 80,
  },
  input: {
    flex: 1,
    backgroundColor: '#263238',
    padding: 10,
    borderRadius: 5,
    color: 'white',
  },
  bioInput: {
    height: 80,
  },
  interestInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#263238',
    padding: 10,
    borderRadius: 5,
    color: 'white',
  },
  interestText: {
    color: 'white',
    flex: 1,
  },
  interestOptions: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: '#263238',
    borderRadius: 5,
    padding: 10,
    zIndex: 10,
  },
  interestOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#455a64',
  },
  interestOptionText: {
    color: 'white',
  },
  saveButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 5,
    marginTop: 30,
    alignSelf: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
