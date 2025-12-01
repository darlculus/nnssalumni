import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  ImageBackground,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';

const {width, height} = Dimensions.get('window');

const carouselImages = [
  {
    id: 1,
    title: 'Welcome Home',
    subtitle: 'NNSS Ojo Alumni Family',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800',
  },
  {
    id: 2,
    title: 'Stay Connected',
    subtitle: 'Network with Success Stories',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
  },
  {
    id: 3,
    title: 'Build Legacy',
    subtitle: 'Shape the Future Together',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800',
  },
  {
    id: 4,
    title: 'Achieve Greatness',
    subtitle: 'From Ojo to the World',
    image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800',
  },
];

const createParticles = () => {
  return Array.from({length: 12}, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 4 + 2,
    opacity: Math.random() * 0.5 + 0.3,
  }));
};

const LandingScreen = ({navigation}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const buttonBounce = useRef(new Animated.Value(1)).current;
  const particleAnims = useRef(createParticles().map(() => new Animated.Value(0))).current;
  const [particles] = useState(createParticles());
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Main entrance animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous animations
    const logoAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    logoAnimation.start();

    const buttonAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(buttonBounce, {
          toValue: 1.02,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(buttonBounce, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    buttonAnimation.start();

    // Floating particles
    const particleAnimations = particleAnims.map((anim, index) => {
      return Animated.loop(
        Animated.timing(anim, {
          toValue: 1,
          duration: 3000 + (index * 200),
          useNativeDriver: true,
        })
      );
    });
    particleAnimations.forEach(anim => anim.start());

    // Auto-change background images
    const imageInterval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % carouselImages.length);
    }, 4000);

    return () => {
      logoAnimation.stop();
      buttonAnimation.stop();
      particleAnimations.forEach(anim => anim.stop());
      clearInterval(imageInterval);
    };
  }, []);

  const renderFloatingParticle = (particle, index) => {
    const translateY = particleAnims[index].interpolate({
      inputRange: [0, 1],
      outputRange: [particle.y, particle.y - 100],
    });
    const opacity = particleAnims[index].interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [particle.opacity, particle.opacity * 0.5, 0],
    });

    return (
      <Animated.View
        key={particle.id}
        style={[
          styles.particle,
          {
            left: particle.x,
            width: particle.size,
            height: particle.size,
            transform: [{translateY}],
            opacity,
          },
        ]}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Floating Particles */}
      <View style={styles.particleContainer} pointerEvents="none">
        {particles.map(renderFloatingParticle)}
      </View>

      {/* Dynamic Background */}
      <ImageBackground 
        source={{uri: carouselImages[currentImageIndex].image}}
        style={styles.backgroundImage}
        imageStyle={{
          resizeMode: 'cover',
          ...(width > 768 ? {
            // Desktop: Better face positioning
            transform: [{translateY: -30}, {scale: 1.1}],
          } : {
            // Mobile: Standard positioning
            transform: [{translateY: -20}],
          })
        }}>
        <LinearGradient
          colors={['rgba(30,60,114,0.4)', 'rgba(42,82,152,0.8)', 'rgba(0,0,0,0.9)']}
          style={styles.overlay}>
          
          <View
            style={[
              styles.contentContainer,
              {
                opacity: fadeAnim,
                transform: [{translateY: slideAnim}],
              },
            ]}>
            
            {/* Animated Logo */}
            <Animated.View 
              style={[
                styles.logoContainer,
                { transform: [{ scale: logoScale }] }
              ]}>
              <LinearGradient
                colors={['#ffffff', '#f0f8ff']}
                style={styles.logoBackground}>
                <Text style={styles.logoText}>NNSS</Text>
                <Text style={styles.logoTextSmall}>OJO</Text>
              </LinearGradient>
              <Text style={styles.logoSubtext}>Alumni Network</Text>
              <View style={styles.logoUnderline} />
            </Animated.View>

            {/* Dynamic Content */}
            <Animated.View style={[
              styles.welcomeContainer,
              { opacity: fadeAnim }
            ]}>
              <Text style={styles.welcomeTitle}>{carouselImages[currentImageIndex].title}</Text>
              <Text style={styles.welcomeSubtitle}>
                {carouselImages[currentImageIndex].subtitle}
              </Text>
              <Text style={styles.tagline}>"Onward Together"</Text>
            </Animated.View>

            {/* Modern Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.loginButton}
                activeOpacity={0.8}
                onPress={() => {
                  console.log('Login button pressed!');
                  navigation.navigate('Auth', {type: 'login'});
                }}>
                <Text style={styles.loginButtonText}>LOGIN</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.signupButton}
                activeOpacity={0.8}
                onPress={() => {
                  console.log('Signup button pressed!');
                  navigation.navigate('Auth', {type: 'signup'});
                }}>
                <Text style={styles.signupButtonText}>JOIN NOW</Text>
              </TouchableOpacity>
            </View>

            {/* Stats */}
            <Animated.View style={[
              styles.statsContainer,
              { opacity: fadeAnim }
            ]}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>500+</Text>
                <Text style={styles.statLabel}>Alumni</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>50+</Text>
                <Text style={styles.statLabel}>Countries</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>25+</Text>
                <Text style={styles.statLabel}>Years</Text>
              </View>
            </Animated.View>

            {/* Indicators */}
            <View style={styles.indicatorContainer}>
              {carouselImages.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    currentImageIndex === index && styles.activeIndicator,
                  ]}
                />
              ))}
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  particleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  particle: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 50,
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBackground: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#1e3c72',
    letterSpacing: 2,
  },
  logoTextSmall: {
    fontSize: 24,
    fontWeight: '700',
    color: '#e55039',
    marginLeft: 5,
  },
  logoSubtext: {
    fontSize: 14,
    color: '#fff',
    marginTop: 8,
    fontWeight: '600',
    letterSpacing: 1,
  },
  logoUnderline: {
    width: 60,
    height: 3,
    backgroundColor: '#e55039',
    marginTop: 5,
    borderRadius: 2,
  },
  welcomeContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 15,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  loginButton: {
    flex: 0.45,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    minHeight: 48,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  signupButton: {
    flex: 0.45,
    backgroundColor: '#e55039',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    minHeight: 48,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingVertical: 15,
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  statLabel: {
    fontSize: 11,
    color: '#ccc',
    fontWeight: '600',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 25,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#e55039',
    width: 20,
  },
});

export default LandingScreen;