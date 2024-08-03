// app/components/DrawerContent.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import profileImage from "../assets/images/default-avatar.webp";
import Icon from "react-native-vector-icons/MaterialIcons";
import Icons from 'react-native-vector-icons/FontAwesome';
// Import the icon library

const DrawerContent = () => {
  const router = useRouter();

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.profileContainer}>
        <Image source={profileImage} style={styles.profileImage} />
        <Text style={styles.profileName}>User Name</Text>
      </View>
      <TouchableOpacity style={styles.drawerItem} onPress={() => router.push('/profile/Profile')}>
        <Icon name="person" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.drawerItemText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerItem} onPress={() => router.push('/profile/EditProfile')}>
        <Icon name="edit" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.drawerItemText}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerItem} onPress={() => router.push('/profile/MyCamps')}>
        <Icon name="camp" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.drawerItemText}>My Camps</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerItem} onPress={() => router.push('/profile/MyJoinedCamps')}>
        <Icon name="group" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.drawerItemText}>My Joined Camps</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerItem} onPress={() => router.push('/profile/RatingAndReviews')}>
      <Icon name="star" size={24} color="#fff" style={styles.icons} />
       <Text style={styles.drawerItemText}>Ratings And Reviews</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.drawerItem} onPress={() => router.push('/logout')}>
        <Icon name="logout" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.drawerItemText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#00595E',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#fff',
    borderWidth: 2,
  },
  profileName: {
    color: '#fff',
    fontSize: 18,
    marginTop: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  drawerItemText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
  icon: {
    marginLeft: 10,
  },
  icons: {
    marginLeft: 10,
  },
});

export default DrawerContent;
