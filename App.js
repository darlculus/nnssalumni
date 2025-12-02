import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import LandingScreen from './src/screens/LandingScreen';
import AuthScreen from './src/screens/AuthScreen';
import OTPScreen from './src/screens/OTPScreen';
import EmailVerificationScreen from './src/screens/EmailVerificationScreen';
import PinSetupScreen from './src/screens/PinSetupScreen';
import PermissionsScreen from './src/screens/PermissionsScreen';
import JoinScreen from './src/screens/JoinScreen';
import DashboardNavigator from './src/navigation/DashboardNavigator';

const Stack = createStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const approved = await AsyncStorage.getItem('isApproved');
      setUserToken(token);
      setIsApproved(approved === 'true');
    } catch (error) {
      console.log('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {userToken ? (
          isApproved ? (
            <Stack.Screen name="Dashboard" component={DashboardNavigator} />
          ) : (
            <Stack.Screen name="Join" component={JoinScreen} />
          )
        ) : (
          <>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen name="OTP" component={OTPScreen} />
            <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
            <Stack.Screen name="PinSetup" component={PinSetupScreen} />
            <Stack.Screen name="Permissions" component={PermissionsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;