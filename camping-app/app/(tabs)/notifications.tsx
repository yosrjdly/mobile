import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';

const notifications = () => {
  const profileImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRuRip5LBOHjlx6SIMhLsGHLxpw_wUUXG8Z0sz9YUBaP9PstT_BmRY1CGaFBqqDeFAX9w&usqp=CAU';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <View style={styles.notification}>
        <Image style={styles.profile} source={{ uri: profileImageUrl }} />
        <View style={styles.info}>
          <Text style={styles.name}>Samir</Text>
          <Text style={styles.message}>Liked your Post</Text>
        </View>
      </View>
      <View style={styles.notification}>
        <Image style={styles.profile} source={{ uri: profileImageUrl }} />
        <View style={styles.info}>
          <Text style={styles.name}>Yosri Bounjeh</Text>
          <Text style={styles.message}>Joined your trip</Text>
        </View>
      </View>
      <View style={styles.notification}>
        <Image style={styles.profile} source={{ uri: profileImageUrl }} />
        <View style={styles.info}>
          <Text style={styles.name}>Samir</Text>
          <Text style={styles.message}>Commented on your Post</Text>
        </View>
      </View>
      <View style={styles.notification}>
        <Image style={styles.profile} source={{ uri: profileImageUrl }} />
        <View style={styles.info}>
          <Text style={styles.name}>Yosri Bounjeh</Text>
          <Text style={styles.message}>Shared your trip</Text>
        </View>
      </View>
    </View>
  );
}

export default notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00595E', // Background color consistent with other components
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#F0F8FF',
    marginBottom: 20,
    textAlign: 'center', // Center the title
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#014043', // Card background color consistent with other components
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  profile: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F0F8FF',
  },
  message: {
    fontSize: 16,
    color: '#B0BEC5', // Text color consistent with other components
  },
});
