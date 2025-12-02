import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Alert,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';

const {width} = Dimensions.get('window');

const OTPScreen = ({navigation, route}) => {
  const {phoneNumber, email} = route.params;
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const inputRefs = useRef([]);

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

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Don't auto-send email on load anymore

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (value, index) => {
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits entered
    if (newOtpValues.every(digit => digit !== '') && !loading) {
      handleVerifyOTP(newOtpValues.join(''));
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (otp = otpValues.join('')) => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter all 6 digits');
      return;
    }

    setLoading(true);
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Send verification email after successful OTP
      setEmailSent(true);
      
      // Navigate to email verification screen
      navigation.navigate('EmailVerification', {email, phoneNumber});
    } catch (error) {
      Alert.alert('Error', 'Invalid OTP. Please try again.');
      setOtpValues(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCountdown(60);
      setCanResend(false);
      setOtpValues(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      Alert.alert('Success', 'New OTP sent to your phone');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP');
    }
  };

  const formatPhoneNumber = (phone) => {
    if (phone.length > 6) {
      return phone.slice(0, -4).replace(/./g, '*') + phone.slice(-4);
    }
    return phone;
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
          
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#fff', '#f0f8ff']}
              style={styles.iconBackground}>
              <Ionicons name="phone-portrait" size={40} color="#1e3c72" />
            </LinearGradient>
          </View>
          
          <Text style={styles.title}>Verify Your Phone</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to
          </Text>
          <Text style={styles.phoneNumber}>{formatPhoneNumber(phoneNumber)}</Text>
        </View>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          <View style={styles.otpInputRow}>
            {otpValues.map((value, index) => (
              <TextInput
                key={index}
                ref={ref => inputRefs.current[index] = ref}
                style={[
                  styles.otpInput,
                  value ? styles.otpInputFilled : null
                ]}
                value={value}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="numeric"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>
          
          {loading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Verifying...</Text>
            </View>
          )}
        </View>

        {/* Email Verification Status */}
        <View style={styles.emailContainer}>
          <View style={styles.emailRow}>
            <Ionicons 
              name="mail" 
              size={20} 
              color="#ccc" 
            />
            <Text style={styles.emailText}>
              Email verification will be sent after OTP confirmation
            </Text>
          </View>
        </View>

        {/* Resend Section */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>
            Didn't receive the code?
          </Text>
          <TouchableOpacity
            style={[
              styles.resendButton,
              !canResend && styles.resendButtonDisabled
            ]}
            onPress={handleResendOTP}
            disabled={!canResend}>
            <Text style={[
              styles.resendButtonText,
              !canResend && styles.resendButtonTextDisabled
            ]}>
              {canResend ? 'Resend OTP' : `Resend in ${countdown}s`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Manual Verify Button */}
        <TouchableOpacity
          style={[
            styles.verifyButton,
            otpValues.every(digit => digit !== '') && styles.verifyButtonActive
          ]}
          onPress={() => handleVerifyOTP()}
          disabled={loading || !otpValues.every(digit => digit !== '')}>
          <LinearGradient
            colors={otpValues.every(digit => digit !== '') 
              ? ['#e55039', '#ff6b6b'] 
              : ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.2)']}
            style={styles.verifyGradient}>
            <Text style={[
              styles.verifyButtonText,
              otpValues.every(digit => digit !== '') && styles.verifyButtonTextActive
            ]}>
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
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
    width: 80,
    height: 80,
    borderRadius: 40,
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
  phoneNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  otpContainer: {
    marginBottom: 30,
  },
  otpInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    width: (width - 80) / 6,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  otpInputFilled: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderColor: '#e55039',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emailContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  resendText: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 10,
  },
  resendButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  resendButtonTextDisabled: {
    textDecorationLine: 'none',
  },
  verifyButton: {
    borderRadius: 12,
    overflow: 'hidden',
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
});

export default OTPScreen;