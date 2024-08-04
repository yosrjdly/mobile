import { View, Text,StyleSheet,Image,ScrollView,TouchableOpacity} from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


import React from 'react'

const Burns = () => {
  const router = useRouter();

    const burnInformation = {
        overview: 'Burns occur when your skin comes into contact with heat, chemicals, electricity, or radiation. The severity of a burn depends on the depth of tissue damage.',
        severityLevels: [
          {
            title: 'First-degree burn',
            description: 'Only the outer layer of skin is damaged. It causes pain, redness, and swelling.'
          },
          {
            title: 'Second-degree burn',
            description: 'Damages the outer and inner layers of skin. It causes pain, redness, blistering, and swelling.'
          },
          {
            title: 'Third-degree burn',
            description: 'Destroys the entire thickness of skin and can damage underlying tissues. The skin may appear charred or white.'
          }
        ],
        firstAidSteps: [
          'Cool the burn immediately with cold water for 10-15 minutes.',
          'Remove any clothing or jewelry from the burned area.',
          'Cover the burn with a clean, dry bandage.',
          'Elevate the burned area if possible.',
          'Take over-the-counter pain relievers if needed.'
        ],
        whenToSeekMedicalHelp: [
          'Burns covering a large area of the body.',
          'Burns on the face, hands, feet, or genitals.',
          'Burns that cause severe pain.',
          'Burns that are accompanied by other injuries.',
          'Burns that do not improve within a few days.',
        ],
        preventionTips: [
          'Be careful when cooking and using hot liquids.',
          'Use sunscreen to protect your skin from the sun.',
          'Wear protective clothing when handling chemicals.',
          'Check the temperature of bathwater before entering.',
          'Keep children away from hot stoves and appliances.'
        ]
      };
      return (
        <ScrollView style={styles.container}>
            <View>
               <TouchableOpacity style={styles.backButton} onPress={() => router.replace('emergenci')} >
                     <AntDesign name="arrowleft" size={24} color="white" />
                 </TouchableOpacity>
      </View>
          <Text style={styles.title}>Burns Treatment</Text>
         <View style={styles.header}>
        <Image source={{uri:'https://www.shutterstock.com/image-vector/burns-degree-first-aid-burn-600nw-1841872525.jpg'}} style={styles.icon} />
         </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.content}>{burnInformation.overview}</Text>
          </View>
    
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Severity Levels</Text>
            {burnInformation.severityLevels.map((level, index) => (
              <View key={index} style={styles.levelItem}>
                <Text style={styles.levelTitle}>* {level.title}</Text>
                <Text style={styles.levelDescription}>.{level.description}</Text>
              </View>
            ))}
          </View>
          <View style={styles.section}>
        <Text style={styles.sectionTitle}>First Aid Steps</Text>
        {burnInformation.firstAidSteps.map((step, index) => (
          <Text key={index} style={styles.content}>- {step}</Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>When to Seek Medical Help</Text>
        {burnInformation.whenToSeekMedicalHelp.map((item, index) => (
          <Text key={index} style={styles.content}>- {item}</Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prevention Tips</Text>
        {burnInformation.preventionTips.map((tip, index) => (
          <Text key={index} style={styles.content}>- {tip}</Text>
        ))}
      </View>
    
        </ScrollView>
      );
    };
    
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
        marginTop:40,
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
      levelDescription: {
        marginTop: 5,
        color: '#fff',

      }, icon: {
        width: 350,
        height: 400,
        marginRight: 20,
        borderRadius: 10,

      }, header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
      }, backButton: {
        position: 'absolute',
        top: 30, // Adjust as needed to move away from the top edge
        left: 10, // Adjust as needed to move away from the left edge
      },
    });
    
    export default Burns;