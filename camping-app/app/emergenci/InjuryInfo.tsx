import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


const injuryInformation = {
    
    typesOfInjuries: [
        {
            injury: 'Sprain',
            symptoms: 'Pain, swelling, bruising, limited ability to move the affected joint',
            treatment: 'Rest, ice, compression, elevation (R.I.C.E.). Over-the-counter pain relievers may help.',
            prevention: 'Warm up before physical activity, wear appropriate footwear, avoid uneven surfaces.'
        },
        {
            injury: 'Fracture',
            symptoms: 'Severe pain, swelling, inability to move the affected area, visible deformity in some cases',
            treatment: 'Immobilize the area, seek medical attention immediately. Do not try to realign the bone.',
            prevention: 'Use protective gear during sports, ensure home safety to prevent falls, maintain bone health.'
        },
        {
            injury: 'Cut or Laceration',
            symptoms: 'Bleeding, pain, possible infection if not treated properly',
            treatment: 'Clean the wound with water, apply an antiseptic, cover with a sterile bandage, and monitor for signs of infection.',
            prevention: 'Use safety equipment, handle sharp objects carefully, keep work areas clean and free of hazards.'
        }
    ],
    generalTips: [
        'Keep a first aid kit available and know how to use it.',
        'Seek professional medical help if the injury is severe or symptoms worsen.',
        'Stay calm and ensure the safety of the injured person and yourself.'
    ]
};

const InjuryInfo=()=> {
    
    const router = useRouter(); 
    
    return (
        <ScrollView style={styles.container}>
      <View>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('emergenci')}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Injury Information</Text>
      <View style={styles.header}>
        <Image source={{ uri: 'https://www.grandslamphysio.com.au/wp-content/uploads/2020/06/rice-image.png' }} style={styles.icon} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Types of Injuries</Text>
        {injuryInformation.typesOfInjuries.map((injury, index) => (
          <View key={index} style={styles.levelItem}>
            <Text style={styles.levelTitle}>* {injury.injury}</Text>
            <Text style={styles.content}>Symptoms: {injury.symptoms}</Text>
            <Text style={styles.content}>Treatment: {injury.treatment}</Text>
            <Text style={styles.content}>Prevention: {injury.prevention}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General Tips</Text>
        {injuryInformation.generalTips.map((tip, index) => (
          <Text key={index} style={styles.content}>- {tip}</Text>
        ))}
      </View>
    </ScrollView>
  );
}

export default InjuryInfo

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00595E', // Emergency color
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
    width: 340,
    height: 200,
    marginRight: 20,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 30, // Adjust as needed to move away from the top edge
    left: 10, // Adjust as needed to move away from the left edge
  },
});