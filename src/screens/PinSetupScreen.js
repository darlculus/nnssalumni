import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PinSetupScreen = ({navigation}) => {
  const handleContinue = async () => {
    await AsyncStorage.setItem('userToken', 'demo_token');
    navigation.navigate('Permissions');
  };

  return (
    <LinearGradient colors={['#1e3c72', '#2a5298']} style={styles.container}>
      <Text style={styles.title}>PIN Setup</Text>
      <Text style={styles.subtitle}>This screen is coming soon!</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue (Demo)</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#1e3c72',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PinSetupScreen;