import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Modal, Pressable, TextInput, Dimensions } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const Shop = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddToCart = (productName) => {
    // Handle the add to cart functionality here
    console.log(`${productName} added to cart!`);
  };

  const handleSearchIconPress = () => {
    // Handle search functionality here
    console.log(`Search for: ${searchQuery}`);
  };

  const handleFilterPress = () => {
    setModalVisible(true);
  };

  const handleCategorySelect = (category) => {
    // Handle category selection here
    console.log(`${category} selected`);
    setModalVisible(false);
  };

  const handleCartIconPress = () => {
    // Handle cart icon press event here
    console.log('Cart icon pressed!');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCartIconPress} style={styles.cartIconContainer}>
          <Icon name="shopping-cart" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>MarketPlace</Text>
      </View>
      <View style={styles.search}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search In CampScout..."
          placeholderTextColor="#00796B"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={handleSearchIconPress}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.filter} onPress={handleFilterPress}>
        <Text style={styles.filterText}>Filter By Category</Text>
        <Text style={styles.filterIcon}>🔻</Text>
      </TouchableOpacity>
      <View style={styles.products}>
        {/* Products List */}
        {productData.map(product => (
          <View key={product.name} style={styles.product}>
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
            />
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>{product.price}</Text>
            <Text style={styles.productCategory}>{product.category}</Text>
            <View style={styles.productRating}>
              {[...Array(product.rating)].map((_, i) => (
                <Text key={i} style={styles.productStar}>★</Text>
              ))}
            </View>
            <TouchableOpacity 
              style={styles.productButton} 
              onPress={() => handleAddToCart(product.name)}
            >
              <Text style={styles.productButtonText}>Add To Cart</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Dropdown Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {categories.map(category => (
              <Pressable 
                key={category} 
                style={styles.modalItem} 
                onPress={() => handleCategorySelect(category)}
              >
                <Text style={styles.modalItemText}>{category}</Text>
              </Pressable>
            ))}
            <Pressable 
              style={styles.closeButton} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
const categories = [
  'BackPacks and Bugs',
  'Tents & Shelters',
  'Sleeping Bags & Pads',
  'Lighting & Lanterns',
  'Camping Fourniture',
  'OutDoor Cooking',
];

const productData = [
  {
    name: 'BackPack',
    image: 'https://img-4.linternaute.com/Mmw9whVmuWQCLoE5bIACsXOtyDA=/1500x/smart/4c1d49ebf5af44248057966a795d5a01/ccmcms-linternaute/10783160.jpg',
    price: '60.00 TND',
    category: 'BackPacks and Bugs',
    rating: 2,
  },
  {
    name: 'Water Proof Tent',
    image: 'https://img-4.linternaute.com/Mmw9whVmuWQCLoE5bIACsXOtyDA=/1500x/smart/4c1d49ebf5af44248057966a795d5a01/ccmcms-linternaute/10783160.jpg',
    price: '350.00 TND',
    category: 'Tents & Shelters',
    rating: 5,
  },
  {
    name: 'Sleeping Bag',
    image: 'https://img-4.linternaute.com/Mmw9whVmuWQCLoE5bIACsXOtyDA=/1500x/smart/4c1d49ebf5af44248057966a795d5a01/ccmcms-linternaute/10783160.jpg',
    price: '120.00 TND',
    category: 'Sleeping Bags & Pads',
    rating: 5,
  },
  {
    name: 'HeadLamp',
    image: 'https://img-4.linternaute.com/Mmw9whVmuWQCLoE5bIACsXOtyDA=/1500x/smart/4c1d49ebf5af44248057966a795d5a01/ccmcms-linternaute/10783160.jpg',
    price: '50.00 TND',
    category: 'Lighting & Lanterns',
    rating: 5,
  },
  {
    name: 'Folding Camping Table',
    image: 'https://img-4.linternaute.com/Mmw9whVmuWQCLoE5bIACsXOtyDA=/1500x/smart/4c1d49ebf5af44248057966a795d5a01/ccmcms-linternaute/10783160.jpg',
    price: '80.00 TND',
    category: 'Camping Fourniture',
    rating: 5,
  },
  {
    name: 'Camping Stove',
    image: 'https://img-4.linternaute.com/Mmw9whVmuWQCLoE5bIACsXOtyDA=/1500x/smart/4c1d49ebf5af44248057966a795d5a01/ccmcms-linternaute/10783160.jpg',
    price: '250.00 TND',
    category: 'OutDoor Cooking',
    rating: 5,
  },
];

export default Shop;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00595E', 
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cartIconContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#00796B',
  },
  searchIcon: {
    fontSize: 20,
    color: '#00796B',
    marginLeft: 10,
  },
  filter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  filterText: {
    fontSize: 16,
    color: '#00796B',
    flex: 1,
  },
  filterIcon: {
    fontSize: 20,
    color: '#00796B',
  },
  products: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  product: {
    backgroundColor: '#014043',  // Updated product card background
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    width: (width / 2) - 30, // Adjust card width to fit two cards per row with spacing
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  productPrice: {
    fontSize: 16,
    color: '#fff',
  },
  productCategory: {
    fontSize: 14,
    color: '#B2DFDB',
  },
  productRating: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  productStar: {
    fontSize: 16,
    color: '#FFD700',
  },
  productButton: {
    backgroundColor: '#00796B',  // Updated button color
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  productButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Dark background for modal
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '50%',
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalItemText: {
    fontSize: 16,
    color: '#00796B',
  },
  closeButton: {
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: '#00796B',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});