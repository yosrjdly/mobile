import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet ,Linking} from 'react-native';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';


const index = () => {

  const handleCall = async () => {
    try {
      const supported = await Linking.canOpenURL('tel:197');
      
      if (supported) {
        await Linking.openURL('tel:197');
      } else {
        console.log("Can't handle this tel: url");
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer} >
          <Text style={styles.headerTitle}>Emergency Help</Text>
        </View>
      </View>

      {/* Main Section */}
      <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.mainLabel}>Urgence</Text>
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <Text style={styles.callButtonText}>call 197</Text>
        </TouchableOpacity>
      </View>
    </View>

      {/* First Aid Information Section */}
        <View style={styles.firstAidSection}>
      <Text style={styles.firstAidTitle}>First Aid Information</Text>
      <View style={styles.infoGrid}>
        <TouchableOpacity style={styles.infoItem}>
          <FontAwesome5 name="fire" size={24} color="#B3492D" />
          <Text style={styles.infoText}>Burns</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoItem}>
          <FontAwesome5 name="bug" size={24} color="#B3492D" />
          <Text style={styles.infoText}>Bites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoItem}>
          <FontAwesome5 name="medkit" size={24} color="#B3492D" />
          <Text style={styles.infoText}>Injuries</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoItem}>
          <FontAwesome5 name="ellipsis-h" size={24} color="#B3492D" />
          <Text style={styles.infoText}>Other</Text>
        </TouchableOpacity>
      </View>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#073436', // Dark green background
    borderRadius: 10,
    elevation: 5, // For Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    margin: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#00474F',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  cardContent: {
    alignItems: 'center'
  },
  mainLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white', // Orange text color
    marginBottom: 10,
  },
  callButton: {
    backgroundColor: '#B3492D', // Orange button background
    padding: 15,
    borderRadius: 50, // Circular button
    width: 120, // Adjust button width as needed
    height: 120, // Adjust button height as needed 
    alignItems: 'center',
    justifyContent: 'center',
  },
  callButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  firstAidSection: {
    marginTop: 20,
  },
  firstAidTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  infoItem: {
    width: 100,
    height: 100,
    backgroundColor: '#073436',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  infoText: {
    color: 'white',
    marginTop: 5,
  },
});



export default index
