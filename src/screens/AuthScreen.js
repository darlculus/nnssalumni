import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';

const AuthScreen = ({navigation, route}) => {
  const {type} = route.params; // 'login' or 'signup'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const validateForm = () => {
    if (type === 'signup') {
      if (!formData.firstName || !formData.lastName) {
        Alert.alert('Error', 'Please fill in all required fields');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return false;
      }
    }
    
    if (!formData.email || !formData.phoneNumber || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid Nigerian phone number');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (type === 'signup') {
        navigation.navigate('OTP', {phoneNumber: formData.phoneNumber, email: formData.email});
      } else {
        // For login, go directly to dashboard (simulate successful login)
        navigation.navigate('Dashboard');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#1e3c72', '#2a5298']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>
              {type === 'signup' ? 'Join Alumni Network' : 'Welcome Back'}
            </Text>
            <Text style={styles.subtitle}>
              {type === 'signup'
                ? 'Create your account to connect with fellow alumni'
                : 'Sign in to your account'}
            </Text>
          </View>

          <View style={styles.formContainer}>
            {type === 'signup' && (
              <View style={styles.nameRow}>
                <View style={styles.nameInput}>
                  <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    placeholderTextColor="#ccc"
                    value={formData.firstName}
                    onChangeText={value => handleInputChange('firstName', value)}
                  />
                </View>
                <View style={styles.nameInput}>
                  <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    placeholderTextColor="#ccc"
                    value={formData.lastName}
                    onChangeText={value => handleInputChange('lastName', value)}
                  />
                </View>
              </View>
            )}

            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#ccc"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={value => handleInputChange('email', value)}
            />

            <TextInput
              style={styles.input}
              placeholder="Phone Number (+234...)"
              placeholderTextColor="#ccc"
              keyboardType="phone-pad"
              value={formData.phoneNumber}
              onChangeText={value => handleInputChange('phoneNumber', value)}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor="#ccc"
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={value => handleInputChange('password', value)}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={24}
                  color="#ccc"
                />
              </TouchableOpacity>
            </View>

            {type === 'signup' && (
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#ccc"
                secureTextEntry={!showPassword}
                value={formData.confirmPassword}
                onChangeText={value => handleInputChange('confirmPassword', value)}
              />
            )}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}>
              <Text style={styles.submitButtonText}>
                {loading
                  ? 'Please wait...'
                  : type === 'signup'
                  ? 'Create Account'
                  : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchButton}
              onPress={() =>
                navigation.replace('Auth', {
                  type: type === 'signup' ? 'login' : 'signup',
                })
              }>
              <Text style={styles.switchButtonText}>
                {type === 'signup'
                  ? 'Already have an account? Sign In'
                  : "Don't have an account? Join Now"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 50,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameInput: {
    flex: 0.48,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    color: '#fff',
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    color: '#fff',
    fontSize: 16,
  },
  eyeButton: {
    padding: 15,
  },
  submitButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#1e3c72',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 15,
    marginBottom: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  switchButtonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default AuthScreen;