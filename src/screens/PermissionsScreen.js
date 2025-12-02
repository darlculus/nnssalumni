import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Alert,
  ScrollView,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';

const {width} = Dimensions.get('window');

const permissions = [
  {
    id: 'camera',
    title: 'Camera Access',
    description: 'Take photos for your profile and share memories',
    icon: 'camera',
    color: '#FF6B6B',
  },
  {
    id: 'location',
    title: 'Location Access',
    description: 'Find alumni events and meetups near you',
    icon: 'location',
    color: '#4ECDC4',
  },
  {
    id: 'contacts',
    title: 'Contacts Access',
    description: 'Connect with alumni already in your contacts',
    icon: 'people',
    color: '#45B7D1',
  },
  {
    id: 'audio',
    title: 'Microphone Access',
    description: 'Record voice messages and join audio calls',
    icon: 'mic',
    color: '#96CEB4',
  },
];

const PermissionsScreen = ({navigation}) => {
  const [permissionStates, setPermissionStates] = useState({});
  const [requesting, setRequesting] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const requestPermission = async (permission) => {
    setRequesting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPermissionStates(prev => ({
        ...prev,
        [permission.id]: 'granted'
      }));
    } catch (error) {
      Alert.alert('Error', 'Failed to request permission');
    } finally {
      setRequesting(false);
    }
  };

  const requestAllPermissions = async () => {
    setRequesting(true);
    
    for (let i = 0; i < permissions.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setPermissionStates(prev => ({
        ...prev,
        [permissions[i].id]: 'granted'
      }));
    }
    
    setRequesting(false);
  };

  const handleContinue = () => {
    console.log('Continue button clicked!');
    navigation.navigate('PinSetup');
  };

  const getPermissionStatus = (permissionId) => {
    return permissionStates[permissionId] || 'pending';
  };

  const grantedCount = Object.values(permissionStates).filter(state => state === 'granted').length;

  return (
    <LinearGradient colors={['#1e3c72', '#2a5298']} style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        
        {/* Next Button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleContinue}>
          <Ionicons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={['#fff', '#f0f8ff']}
            style={styles.headerIcon}>
            <Ionicons name="shield-checkmark" size={30} color="#1e3c72" />
          </LinearGradient>
          
          <Text style={styles.title}>App Permissions</Text>
          <Text style={styles.subtitle}>
            Help us provide the best experience
          </Text>
        </View>

        {/* Progress */}
        <Text style={styles.progressText}>
          {grantedCount} of {permissions.length} permissions granted
        </Text>

        {/* Permissions */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {permissions.map((permission) => {
            const status = getPermissionStatus(permission.id);
            
            return (
              <View key={permission.id} style={[
                styles.permissionCard,
                status === 'granted' && styles.permissionCardGranted
              ]}>
                <View style={[styles.iconContainer, { backgroundColor: permission.color }]}>
                  <Ionicons name={permission.icon} size={24} color="#fff" />
                </View>
                
                <View style={styles.permissionInfo}>
                  <Text style={styles.permissionTitle}>{permission.title}</Text>
                  <Text style={styles.permissionDescription}>{permission.description}</Text>
                </View>
                
                <View style={styles.statusContainer}>
                  {status === 'granted' ? (
                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  ) : (
                    <TouchableOpacity
                      style={styles.allowButton}
                      onPress={() => requestPermission(permission)}
                      disabled={requesting}>
                      <Text style={styles.allowButtonText}>Allow</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Fixed Bottom Buttons */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={styles.allowAllButton}
            onPress={requestAllPermissions}
            disabled={requesting || grantedCount === 4}>
            <Text style={styles.allowAllButtonText}>
              {requesting ? 'Requesting...' : grantedCount === 4 ? 'All Granted!' : 'Allow All'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.continueButton,
              grantedCount > 0 && styles.continueButtonActive
            ]}
            onPress={handleContinue}>
            <Text style={[
              styles.continueButtonText,
              grantedCount > 0 && styles.continueButtonTextActive
            ]}>
              {grantedCount > 0 
                ? `Continue to Pin Setup (${grantedCount}/4)`
                : 'Grant permissions to continue'}
            </Text>
          </TouchableOpacity>
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
  },
  nextButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
  },
  progressText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    marginBottom: 20,
  },
  permissionCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  permissionCardGranted: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  permissionInfo: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  permissionDescription: {
    fontSize: 11,
    color: '#ccc',
    lineHeight: 16,
  },
  statusContainer: {
    alignItems: 'center',
  },
  allowButton: {
    backgroundColor: '#e55039',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  allowButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  bottomButtons: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  allowAllButton: {
    backgroundColor: '#e55039',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 15,
  },
  allowAllButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  continueButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  continueButtonActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ccc',
    textAlign: 'center',
  },
  continueButtonTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default PermissionsScreen;