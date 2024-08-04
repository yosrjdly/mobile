import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
const router = useRouter(); 

const Bites = () => {

    const insectBiteInformation = {
        typesOfBites: [
          {
            insect: 'Mosquito',
            symptoms: 'Itchy red bumps, swelling',
            treatment: 'Apply calamine lotion or hydrocortisone cream. Avoid scratching.',
            prevention: 'Use insect repellent, wear long sleeves and pants, and eliminate standing water.'
          },
          {
            insect: 'Tick',
            symptoms: 'Red, raised bump at the bite site, flu-like symptoms in some cases',
            treatment: 'Remove the tick carefully, clean the area with soap and water, monitor for symptoms.',
            prevention: 'Wear protective clothing, use insect repellent, check for ticks after spending time outdoors.'
          },
          {
            insect: 'Bee or Wasp',
            symptoms: 'Pain, swelling, redness at the bite site',
            treatment: 'Remove the stinger if present, apply a cold compress, take an over-the-counter antihistamine.',
            prevention: 'Avoid wearing perfumes or bright colors, be cautious when eating outdoors.'
          }
        ],
        generalTips: [
          'Avoid scratching the bite to prevent infection.',
          'Over-the-counter pain relievers can help with discomfort.',
          'Seek medical attention if symptoms worsen or if you experience an allergic reaction.'
        ]
      };
  return (
    <ScrollView style={styles.container}>
      <View>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('emergenci')}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Insect Bite Information</Text>
      <View style={styles.header}>
        <Image source={{ uri: 'https://www.campcraft.co.za/wp-content/uploads/2020/01/Campcraft-Article-What-just-bit-me.jpg.webp' }} style={styles.icon} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Types of Bites</Text>
        {insectBiteInformation.typesOfBites.map((bite, index) => (
          <View key={index} style={styles.levelItem}>
            <Text style={styles.levelTitle}>* {bite.insect}</Text>
            <Text style={styles.content}>Symptoms: {bite.symptoms}</Text>
            <Text style={styles.content}>Treatment: {bite.treatment}</Text>
            <Text style={styles.content}>Prevention: {bite.prevention}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General Tips</Text>
        {insectBiteInformation.generalTips.map((tip, index) => (
          <Text key={index} style={styles.content}>- {tip}</Text>
        ))}
      </View>
    </ScrollView>
  );
}
 
export default Bites

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00595E', // Emergency red color
    padding: 20,
  },
  title: {
    color: '#fff', // White text for better contrast
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#073436',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#B3492D',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  content: {
    marginBottom: 20,
    color: '#fff',
  },
  levelItem: {
    marginBottom: 10,
  },
  levelTitle: {
    fontWeight: 'bold',
    color: '#fff',
  },
  icon: {
    width: 350,
    height:200,
    marginRight: 20,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    top: 30, // Adjust as needed to move away from the top edge
    left: 10, // Adjust as needed to move away from the left edge
  },
});