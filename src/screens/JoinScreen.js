import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JoinScreen = ({navigation}) => {
  const handleJoin = async () => {
    await AsyncStorage.setItem('isApproved', 'true');
    navigation.replace('Dashboard');
  };

  return (
    <LinearGradient colors={['#1e3c72', '#2a5298']} style={styles.container}>
      <Text style={styles.title}>Join Alumni Network</Text>
      <Text style={styles.subtitle}>Fill in your graduation details</Text>
      <Text style={styles.note}>This screen is coming soon!</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={handleJoin}>
        <Text style={styles.buttonText}>Join Now (Demo)</Text>
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
    marginBottom: 20,
  },
  note: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
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

export default JoinScreen;