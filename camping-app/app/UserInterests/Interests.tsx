import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Image, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams} from 'expo-router';
import axios from 'axios';

const { width } = Dimensions.get('window');

type Interest = 'Hitchhiking' | 'Kayaking' | 'Climbing' | 'Hiking' | 'Fishing' | 'Other';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  interests: Interest[];
}

const Interests = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);

  const updateInterests = async (userId: string, interests: Interest[]) => {
    try {
      const response = await axios.post('http://192.168.10.4:5000/api/users/updateInterests', { userId, interests });
      console.log('Success', response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);


  const handleInterestPress = (interest: Interest) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(item => item !== interest) : [...prev, interest]
    );
  };

  const handleDone = () => {
    if (typeof userId === 'string') {
      updateInterests(userId, selectedInterests)
      router.push('/auth/SignIn');
    } else {
      console.error('Invalid userId')
    }
  };
  

  const handleSkip = () => {
    router.push('/auth/SignIn');
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Animated.Text style={[styles.title, { transform: [{ translateY: slideAnim }] }]}>Tell us</Animated.Text>
      <Animated.Text style={[styles.title, { transform: [{ translateY: slideAnim }] }]}>What you love</Animated.Text>
      <Animated.Text style={[styles.subtitle, { transform: [{ translateY: slideAnim }] }]}>
        So we can show you what you like. Come back and change this whenever.
      </Animated.Text>
      <View style={styles.interestContainer}>
        {['Hitchhiking', 'Kayaking', 'Climbing', 'Hiking', 'Fishing', 'Other'].map((interest) => (
          <TouchableOpacity
            key={interest}
            style={[styles.interestBtn, selectedInterests.includes(interest as Interest) && styles.selectedInterestBtn]}
            onPress={() => handleInterestPress(interest as Interest)}
          >
            <View style={styles.iconContainer}>
              <Image 
                source={{ uri: getImageUri(interest as Interest) }} 
                style={styles.interestIcon} 
                resizeMode="cover" 
              />
            </View>
            <Text style={styles.interestText}>{interest}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.doneBtn} onPress={handleDone}>
        <Text style={styles.doneText}>Done</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const getImageUri = (interest: Interest) => {
  const imageUris: Record<Interest, string> = {
    Hitchhiking: 'https://cdn.dribbble.com/users/589499/screenshots/3583371/hikeman_01_4x3.gif',
    Kayaking: 'https://cdn.dribbble.com/users/230073/screenshots/3780396/kayak8.gif',
    Climbing: 'https://i.pinimg.com/originals/f8/80/28/f88028821915496a4fa2622a6f89e658.gif',
    Hiking: 'https://cdn.dribbble.com/users/422998/screenshots/1282571/dribbblegif.gif',
    Fishing: 'https://cdn.dribbble.com/users/3683190/screenshots/8631389/media/3862fb67eead2fc355e2351441d87b19.gif',
    Other: 'https://data.textstudio.com/output/sample/animated/8/4/5/5/other-1-5548.gif'
  };
  return imageUris[interest];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00595E',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#E0F7FA',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#B2EBF2',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  interestContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: width - 40,
    marginBottom: 20,
  },
  interestBtn: {
    width: '30%',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    margin: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedInterestBtn: {
    backgroundColor: '#00695C',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  interestIcon: {
    width: '100%',
    height: '100%',
  },
  interestText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  doneBtn: {
    backgroundColor: '#B3492D',
    padding: 15,
    borderRadius: 8,
    width: '90%',
    marginBottom: 20,
    shadowColor: '#004d40',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  doneText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  skipBtn: {
    backgroundColor: '#004d40',
    padding: 15,
    borderRadius: 8,
    width: '90%',
    shadowColor: '#004d40',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  skipText: {
    color: '#E0F7FA',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Interests;

