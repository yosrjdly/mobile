import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import UserCard from './UserCard'; // Import the UserCard component
import { router } from 'expo-router';

const sampleUsers = [
  { id: '1', name: 'test1 testing', image: 'https://via.placeholder.com/150' },
  { id: '2', name: 'test2 testing', image: 'https://via.placeholder.com/150' },
  { id: '3', name: 'test3 testing', image: 'https://via.placeholder.com/150' },
];

const SearchByName = () => {
  const handleBackPress = () => {
    router.replace('home')
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Icon name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.text}>Search</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your search"
          placeholderTextColor="#CCCCCC"
        />
        <TouchableOpacity style={styles.iconContainer}>
          <Icon name="search" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={sampleUsers}
        renderItem={({ item }) => <UserCard user={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.cardList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00595E',
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    paddingTop: 50, 
    position: 'relative', 
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
  },
  text: {
    color: '#FFFFFF', 
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20, 
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20, 
    width: '80%', 
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#FFFFFF', 
    borderRadius: 20,
    paddingHorizontal: 15,
    color: '#000000', 
  },
  iconContainer: {
    marginLeft: 10, 
    backgroundColor: '#00796B', 
    borderRadius: 25, 
    padding: 10, 
    shadowColor: '#000000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 4, 
    elevation: 5, 
  },
  cardList: {
    width: '100%',
    paddingHorizontal: 10,
  },
});

export default SearchByName;
