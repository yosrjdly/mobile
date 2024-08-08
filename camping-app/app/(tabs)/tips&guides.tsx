import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList, Pressable } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';

const categories = [
  'ShelterAndSleeping',
  'CookingAndEating',
  'ClothingAndFootwear',
  'NavigationAndSafety',
  'PersonalItemsAndComfort',
  'Miscellaneous',
  'OptionalButUseful',
];

const TipsAndGuides = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Filter by Category');

  const handleAddTipPress = () => {

  };

  const handleFilterByCategoryPress = () => {
    setModalVisible(true); 
  };

  const handleTutorialsPress = () => {
    router.replace("Tutoriels/Tutoriels")
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category); 
    setModalVisible(false); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tips and Guides</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddTipPress}>
        <Text style={styles.addButtonText}>Add a Tip</Text>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.categoryButton} onPress={handleFilterByCategoryPress}>
          <Icon name="filter-list" size={24} color="#FFFFFF" style={styles.icon} />
          <Text style={styles.buttonText}>{selectedCategory}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tutorialButton} onPress={handleTutorialsPress}>
          <Icon name="school" size={24} color="#FFFFFF" style={styles.icon} />
          <Text style={styles.buttonText}>Tutorials</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for category selection */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.categoryItem} onPress={() => handleCategorySelect(item)}>
                  <Text style={styles.categoryText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00595E',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 35,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  addButton: {
    marginTop: 20,
    backgroundColor: '#B3492D',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  categoryButton: {
    backgroundColor: '#B3492D',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    justifyContent: 'center',
  },
  tutorialButton: {
    backgroundColor: '#B3492D',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    textAlign: 'center',
  },
  icon: {},
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#00595E',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  categoryItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#B3492D',
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default TipsAndGuides;
