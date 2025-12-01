import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';

const {width} = Dimensions.get('window');

const DashboardScreen = () => {
  const userData = {
    name: 'John Doe',
    graduationYear: '2010',
    pendingBalance: 15000,
    notifications: 3,
  };

  const graduationYears = ['2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012'];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Header */}
        <LinearGradient colors={['#1e3c72', '#2a5298']} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userName}>{userData.name}</Text>
              <Text style={styles.userClass}>Class of {userData.graduationYear}</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications" size={24} color="#fff" />
              {userData.notifications > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationCount}>{userData.notifications}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.balanceCard}>
            <View style={styles.balanceInfo}>
              <Text style={styles.balanceLabel}>Pending Balance</Text>
              <Text style={styles.balanceAmount}>₦{userData.pendingBalance.toLocaleString()}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="card" size={32} color="#1e3c72" />
              <Text style={styles.actionText}>Pay Dues</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="chatbubbles" size={32} color="#1e3c72" />
              <Text style={styles.actionText}>Chat Rooms</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="newspaper" size={32} color="#1e3c72" />
              <Text style={styles.actionText}>News & Events</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="person" size={32} color="#1e3c72" />
              <Text style={styles.actionText}>My Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Class Groups */}
        <View style={styles.classGroups}>
          <Text style={styles.sectionTitle}>Class Groups</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {graduationYears.map((year, index) => (
              <TouchableOpacity key={index} style={styles.classCard}>
                <LinearGradient
                  colors={['#1e3c72', '#2a5298']}
                  style={styles.classCardGradient}>
                  <Text style={styles.classYear}>{year}</Text>
                  <Text style={styles.classLabel}>Set</Text>
                  <View style={styles.classMembersInfo}>
                    <Ionicons name="people" size={16} color="#fff" />
                    <Text style={styles.classMembersCount}>
                      {Math.floor(Math.random() * 50) + 20} members
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recent News */}
        <View style={styles.recentNews}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent News</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.newsCard}>
            <View style={styles.newsContent}>
              <Text style={styles.newsTitle}>Annual Alumni Reunion 2024</Text>
              <Text style={styles.newsDate}>December 15, 2024</Text>
              <Text style={styles.newsPreview}>
                Join us for the biggest alumni gathering of the year...
              </Text>
            </View>
            <Ionicons name="calendar" size={24} color="#1e3c72" />
          </View>

          <View style={styles.newsCard}>
            <View style={styles.newsContent}>
              <Text style={styles.newsTitle}>New Scholarship Program</Text>
              <Text style={styles.newsDate}>November 28, 2024</Text>
              <Text style={styles.newsPreview}>
                We're launching a new scholarship program for current students...
              </Text>
            </View>
            <Ionicons name="school" size={24} color="#1e3c72" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
    paddingTop: 50,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: '#ccc',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  userClass: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 2,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  balanceCard: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceInfo: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  quickActions: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: (width - 60) / 2,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  classGroups: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  classCard: {
    marginRight: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  classCardGradient: {
    width: 120,
    height: 100,
    padding: 15,
    justifyContent: 'space-between',
  },
  classYear: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  classLabel: {
    fontSize: 12,
    color: '#ccc',
  },
  classMembersInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  classMembersCount: {
    fontSize: 10,
    color: '#fff',
    marginLeft: 5,
  },
  recentNews: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAllText: {
    fontSize: 14,
    color: '#1e3c72',
    fontWeight: '600',
  },
  newsCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newsContent: {
    flex: 1,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  newsDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  newsPreview: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default DashboardScreen;