import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Alert,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';

const {width} = Dimensions.get('window');

const EmailVerificationScreen = ({navigation, route}) => {
  const {email, phoneNumber} = route.params;
  const [emailSent, setEmailSent] = useState(false);
  const [checking, setChecking] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Send email after component mounts
    setTimeout(() => {
      setEmailSent(true);
      // Start pulse animation for email icon
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, 1500);
  }, []);

  const handleVerificationCheck = async () => {
    setChecking(true);
    try {
      // Simulate checking verification status
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate directly to Permissions screen
      navigation.navigate('Permissions');
    } catch (error) {
      Alert.alert('Error', 'Email not verified yet. Please check your email and click the verification link.');
      setChecking(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Success', 'Verification email resent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend email');
    }
  };

  const maskEmail = (email) => {
    const [username, domain] = email.split('@');
    const maskedUsername = username.length > 2 
      ? username[0] + '*'.repeat(username.length - 2) + username[username.length - 1]
      : username;
    return `${maskedUsername}@${domain}`;
  };

  return (
    <LinearGradient colors={['#1e3c72', '#2a5298']} style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}],
          }
        ]}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <Animated.View 
            style={[
              styles.iconContainer,
              { transform: [{ scale: pulseAnim }] }
            ]}>
            <LinearGradient
              colors={emailSent ? ['#4CAF50', '#66BB6A'] : ['#fff', '#f0f8ff']}
              style={styles.iconBackground}>
              <Ionicons 
                name={emailSent ? "mail-open" : "mail"} 
                size={50} 
                color={emailSent ? "#fff" : "#1e3c72"} 
              />
            </LinearGradient>
          </Animated.View>
          
          <Text style={styles.title}>Check Your Email</Text>
          <Text style={styles.subtitle}>
            {emailSent 
              ? 'We\'ve sent a verification link to'
              : 'Sending verification email to'}
          </Text>
          <Text style={styles.emailAddress}>{maskEmail(email)}</Text>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>
              Open your email app and look for our verification email
            </Text>
          </View>
          
          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>
              Click the verification link in the email
            </Text>
          </View>
          
          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>
              Return to this app and tap "I've Verified" below
            </Text>
          </View>
        </View>

        {/* Status */}
        {emailSent && (
          <Animated.View style={styles.statusContainer}>
            <View style={styles.statusRow}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.statusText}>
                Verification email sent successfully
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.verifyButton,
              emailSent && styles.verifyButtonActive
            ]}
            onPress={handleVerificationCheck}
            disabled={!emailSent || checking}>
            <LinearGradient
              colors={emailSent 
                ? ['#e55039', '#ff6b6b'] 
                : ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.2)']}
              style={styles.verifyGradient}>
              <Text style={[
                styles.verifyButtonText,
                emailSent && styles.verifyButtonTextActive
              ]}>
                {checking ? 'Checking...' : 'I\'ve Verified'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResendEmail}>
            <Text style={styles.resendButtonText}>
              Didn't receive the email? Resend
            </Text>
          </TouchableOpacity>
        </View>

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>
            Check your spam folder if you don't see the email in your inbox
          </Text>
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    position: 'absolute',
    left: -10,
    top: -20,
    padding: 10,
    zIndex: 1,
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 5,
  },
  emailAddress: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  instructionsContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e55039',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  stepText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  statusContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  buttonContainer: {
    marginBottom: 30,
  },
  verifyButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
  },
  verifyButtonActive: {
    shadowColor: '#e55039',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  verifyGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  verifyButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ccc',
  },
  verifyButtonTextActive: {
    color: '#fff',
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  resendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  helpContainer: {
    alignItems: 'center',
  },
  helpText: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default EmailVerificationScreen;