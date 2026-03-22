import React from 'react';
import { Platform, ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, BottomTabParamList, AuthStackParamList } from '../types/inventory';
import { Typography } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

import HomeScreen from '../screens/HomeScreen';
import ScanScreen from '../screens/ScanScreen';
import ShelvesScreen from '../screens/ShelvesScreen';
import ItemsScreen from '../screens/ItemsScreen';
import ShelfDetailScreen from '../screens/ShelfDetailScreen';
import AddShelfScreen from '../screens/AddShelfScreen';
import ShelfCreatedQRScreen from '../screens/ShelfCreatedQRScreen';
import SearchScreen from '../screens/SearchScreen';
import PrintQRScreen from '../screens/PrintQRScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AppPreferencesScreen from '../screens/AppPreferencesScreen';
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
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          const iconConfig = TAB_ICONS[route.name];
          const iconName = focused ? iconConfig.active : iconConfig.inactive;
          return (
            <Ionicons
              name={iconName}
              size={24}
              color={focused ? colors.PrimaryBlue : colors.GrayText}
            />
          );
        },
        tabBarActiveTintColor: colors.PrimaryBlue,
        tabBarInactiveTintColor: colors.GrayText,
        tabBarStyle: {
          backgroundColor: colors.TabBar,
          borderTopColor: colors.Border,
          borderTopWidth: 1,
          paddingTop: 6,
          height: Platform.OS === 'ios' ? 88 : 64,
          shadowColor: colors.DarkText,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontFamily: Typography.fontFamily.medium,
          fontSize: Typography.sizes.xs,
          marginTop: 2,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: t.home }} />
      <Tab.Screen name="Scan" component={ScanScreen} options={{ tabBarLabel: t.scan }} />
      <Tab.Screen name="Shelves" component={ShelvesScreen} options={{ tabBarLabel: t.shelves }} />
      <Tab.Screen name="Items" component={ItemsScreen} options={{ tabBarLabel: t.items }} />
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
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="AppPreferences" component={AppPreferencesScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();
  const { colors } = useTheme();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.Background }}>
        <ActivityIndicator size="large" color={colors.PrimaryBlue} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
