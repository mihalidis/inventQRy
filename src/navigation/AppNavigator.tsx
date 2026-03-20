import React from 'react';
import { Platform, StyleSheet, ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, BottomTabParamList, AuthStackParamList } from '../types/inventory';
import { Colors, Typography } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

import HomeScreen from '../screens/HomeScreen';
import ScanScreen from '../screens/ScanScreen';
import ShelvesScreen from '../screens/ShelvesScreen';
import ItemsScreen from '../screens/ItemsScreen';
import ShelfDetailScreen from '../screens/ShelfDetailScreen';
import AddShelfScreen from '../screens/AddShelfScreen';
import ShelfCreatedQRScreen from '../screens/ShelfCreatedQRScreen';
import SearchScreen from '../screens/SearchScreen';
import PrintQRScreen from '../screens/PrintQRScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

const TAB_ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Scan: { active: 'scan', inactive: 'scan-outline' },
  Shelves: { active: 'layers', inactive: 'layers-outline' },
  Items: { active: 'list', inactive: 'list-outline' },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, size }) => {
          const iconConfig = TAB_ICONS[route.name];
          const iconName = focused ? iconConfig.active : iconConfig.inactive;
          return (
            <Ionicons
              name={iconName}
              size={24}
              color={focused ? Colors.PrimaryBlue : Colors.GrayText}
            />
          );
        },
        tabBarActiveTintColor: Colors.PrimaryBlue,
        tabBarInactiveTintColor: Colors.GrayText,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Scan" component={ScanScreen} />
      <Tab.Screen name="Shelves" component={ShelvesScreen} />
      <Tab.Screen name="Items" component={ItemsScreen} />
    </Tab.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="ShelfDetail" component={ShelfDetailScreen} />
      <Stack.Screen name="AddShelf" component={AddShelfScreen} />
      <Stack.Screen name="ShelfCreatedQR" component={ShelfCreatedQRScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="PrintQR" component={PrintQRScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PrimaryBlue} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.Background,
  },
  tabBar: {
    backgroundColor: Colors.Background,
    borderTopColor: Colors.Border,
    borderTopWidth: 1,
    paddingTop: 6,
    height: Platform.OS === 'ios' ? 88 : 64,
    shadowColor: Colors.DarkText,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 8,
  },
  tabLabel: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.sizes.xs,
    marginTop: 2,
  },
});
