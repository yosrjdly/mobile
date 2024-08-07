import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import UserCard from './UserCard'; 
import { router } from 'expo-router';
import axios from 'axios'; 

const SearchByName = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [noResults, setNoResults] = useState(false); 

  const handleBackPress = () => {
    router.replace('home');
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://192.168.10.4:5000/api/users/search', {
        params: { name: searchTerm },
      });

      if (response.data.data.length === 0) {
        setNoResults(true); 
      } else {
        setNoResults(false); 
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setNoResults(true); 
    }
  };

  const handleChange = (text) => {
    setSearchTerm(text);
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
          value={searchTerm}
          onChangeText={handleChange}
        />
        <TouchableOpacity style={styles.iconContainer} onPress={handleSearch}>
          <Icon name="search" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      {noResults ? (
        <Text style={styles.noResultsText}>No users found</Text>
      ) : (
        <FlatList
          data={users}
          renderItem={({ item }) => <UserCard user={item} />}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.cardList}
        />
      )}
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
  noResultsText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: 20,
  },
});

export default SearchByName;
