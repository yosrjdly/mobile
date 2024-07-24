import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const LoginScreen = () => {
  return (
    <ImageBackground 
      source={{ uri: 'https://images.ctfassets.net/jxp0iaf0waox/4vIPUXYin41sR4fswBzFJD/1a52a94a60964682d2a894f2c7823e3f/ill6.jpg?w=635&h=635&q=70' }} 
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        
        <Text style={styles.label}>Email:</Text>
        <TextInput 
          style={styles.input} 
          placeholder="your Email ..." 
          placeholderTextColor="#aaa" 
        />
        
        <Text style={styles.label}>Password:</Text>
        <TextInput 
          style={styles.input} 
          placeholder="your Password ..." 
          placeholderTextColor="#aaa" 
          secureTextEntry
        />
        
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        
        <Text style={styles.or}>OR</Text>
        
        <TouchableOpacity style={styles.googleButton}>
          <AntDesign name="google" size={24} color="black" style={styles.googleIcon} />
          <Text style={styles.googleButtonText}>Join us with Google</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: 'white',
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    color: 'white',
  },
  forgotPassword: {
    color: 'white',
    textAlign: 'right',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#B3492D',
    borderRadius: 10,
    paddingVertical: 10,
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  or: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButtonText: {
    color: '#000000',
    fontSize: 18,
    textAlign: 'center',
    marginLeft: 10,
  },
  googleIcon: {
    marginRight: 10,
  },
});
