import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

const UserCard = ({ user }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/SearchedUserProfile/UserProfile?userId=${user.id}`); 
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={handlePress}>
        <Image 
          source={{ uri: user.imagesProfile?.[0] || 'default-image-url' }} 
          style={styles.image} 
        />
      </TouchableOpacity>
      <Text style={styles.name}>{user.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#014043', 
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5, 
    borderWidth: 1, 
    borderColor: '#DDDDDD', 
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 2, 
    borderColor: '#DDDDDD', 
  },
  name: {
    fontSize: 16,
    color: '#fff', 
    fontWeight: '600',
  },
});

export default UserCard;
