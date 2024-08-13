import React, { useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import interests from '../UserInterests/Interests'

interface User {

  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string): boolean => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  const validatePassword = (password: string): boolean => {
    const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{7,}$/;
    return pattern.test(password);
  };

  const handleRegister = async () => {
    try {
      if (!name || !email || !password || !confirmPassword) {
        throw new Error('All fields are required');
      }

      if (!validateEmail(email)) {
        throw new Error('Please enter a valid email address');
      }

      if (!validatePassword(password)) {
        throw new Error('Password must be at least 7 characters long, and include uppercase, lowercase, digit, and special character');
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      setIsSubmitting(true);

      const userData: User = { name, email, password, confirmPassword };



      const response = await axios.post('http://192.168.10.13:5000/api/users/register', userData);


      Alert.alert('Success', response.data.message)
      setUser(response.data.user)
      console.log(response.data.user)
      router.replace({
        pathname: 'UserInterests/Interests',
        params: { userId: response.data.user.id } // Pass userId as a parameter
      });
    } catch (err: any) {
      console.error('Registration failed:', err)
      setError(err.message);
      Alert.alert('Registration Error', err.message)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.ctfassets.net/jxp0iaf0waox/4vIPUXYin41sR4fswBzFJD/1a52a94a60964682d2a894f2c7823e3f/ill6.jpg?w=635&h=635&q=70' }}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <Text style={styles.title}>Register</Text>

            <Text style={styles.label}>Full Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Your Full Name"
              placeholderTextColor="#ddd"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              placeholder="Your Email"
              placeholderTextColor="#ddd"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <Text style={styles.label}>Password:</Text>
            <TextInput
              style={styles.input}
              placeholder="Your Password"
              placeholderTextColor="#ddd"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <Text style={styles.label}>Confirm Password:</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm Your Password"
              placeholderTextColor="#ddd"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={isSubmitting}
            >
              <Text style={styles.registerButtonText}>
                {isSubmitting ? 'Registering...' : 'Register'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.or}>OR</Text>

            <TouchableOpacity style={styles.googleButton}>
              <AntDesign name="google" size={24} color="black" style={styles.googleIcon} />
              <Text style={styles.googleButtonText}>Join Us With Google</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace('auth/SignIn')}>
              <Text style={styles.registerLink}>
                Already have an account? <Text style={styles.registerLinkBold}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};


export default RegisterScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'flex-start',
    marginBottom: 5,
    width: '100%',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    color: 'white',
    width: '100%',
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#B3492D',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginBottom: 20,
    width: '100%',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  or: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
    width: '100%',
  },
  googleIcon: {
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
  },
  registerLink: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
  registerLinkBold: {
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});
